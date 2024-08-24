/*
 * vanilla CBOR decoder / encoder
 * https://github.com/webauthnworks/vanillaCBOR
 *
 * Copyright (c) 2018-2021 Yuriy Ackermann <ackermann.yuriy@gmail.com> <yuriy@webauthn.works>
 * Licensed under the MIT license.
 */
(function(){
    'use strict';

    const tags = {
        0: 'UNSIGNED_INT',
        1: 'NEGATIVE_INT',
        2: 'BYTE_STRING',
        3: 'TEXT_STRING',
        4: 'ARRAY',
        5: 'MAP',
        6: 'OTHER_SEM',
        7: 'FLOAT_AND_NO_CONTENT'
    }

    const float_and_no_content_semantics = {
        20: "FALSE",
        21: "TRUE",
        22: "NULL",
        23: "UNDEFINED",
        24: "SIMPLE_CONT", // Simple value (value 32..255 in following byte)
        25: "FLOAT_16", // IEEE 754 Half-Precision Float (16 bits follow)
        26: "FLOAT_32", // IEEE 754 Single-Precision Float (32 bits follow)
        27: "FLOAT_64", // IEEE 754 Double-Precision Float (64 bits follow)
        31: "INFINITY_BREAK"
    }

    const type = (obj) => {
        return {}.toString.call(obj)
                 .replace(/\[|\]/g, '')
                 .split(' ')[1];
    }

    const enforceUint8Array = (buffer) => {
        let bufferType = type(buffer)
        
        if( bufferType != 'Uint8Array' &&
            bufferType != 'Uint16Array' &&
            bufferType != 'Uint32Array' &&
            bufferType != 'Array' &&
            bufferType != 'ArrayBuffer' )
           throw new TypeError('Only BufferSource is allowed!');

        if(bufferType == 'ArrayBuffer' || bufferType == 'Array')
            return new Uint8Array(buffer.slice())
        else
            return new Uint8Array(buffer.buffer.slice())

        return temp
    }


    const mergeTwoBuffers = function(buffer1, buffer2) {
        buffer1 = enforceBigEndian(enforceUint8Array(buffer1));
        buffer2 = enforceBigEndian(enforceUint8Array(buffer2));

        let totalLength = buffer1.length + buffer2.length;

        let mergedBuffers = new Uint8Array(totalLength);
        mergedBuffers.set(buffer1);
        mergedBuffers.set(buffer2, buffer1.length);

        return mergedBuffers
    }

    const isEndianBig = () => {
        let buff = new ArrayBuffer(2);
        let u8   = new Uint8Array(buff);
        let u16  = new Uint16Array(buff);

        u8[0]    = 0xCC;
        u8[1]    = 0xDD;

        if(u16[0] !== 0xDDCC)
            return false

        return true
    }

    const enforceBigEndian = (buffer) => {
        if(isEndianBig())
            buffer = buffer.reverse();

        return buffer
    }

    const readBE81632 = (buffer) => {
        if(typeof Buffer === 'undefined')
            buffer = enforceUint8Array(buffer);
        
        buffer = enforceBigEndian(buffer);

        if(buffer.length !== 1 && buffer.length !== 2 && buffer.length !== 4)
            throw new Error('Only 2/4/16 byte buffers are allowed!');

        buffer = new Uint8Array(Array.from(buffer));
        if(buffer.length === 1)
            return buffer[0]
        else if(buffer.length === 2)
            return new Uint16Array(buffer.buffer)[0]
        else
            return new Uint32Array(buffer.buffer)[0]
    }

    const getTLVForNext = (buffer) => {
        if(buffer.length == 1 && buffer[0] == 0xff) {
            return {
                TAG: tags[7],
                VAL: 31,
                LEN: 1
            }
        }

        let lennum   = buffer[0] - (buffer[0] & 32) - (buffer[0] & 64) - (buffer[0] & 128);
        let tagnum   = (buffer[0] - lennum) >> 5;
        let VAL = undefined;
        let TAG = tags[tagnum];

        let LEN = 0;
        let TLLEN = 1;

        if(lennum < 24) {
            VAL = lennum;
        } else {
            VAL = buffer.slice(1);
            if(lennum === 24) { // 1 byte len
                LEN = readBE81632(VAL.slice(0, 1));
                VAL = VAL.slice(1);
                TLLEN += 1;
            } else if(lennum === 25) { // 2 byte len
                LEN = readBE81632(VAL.slice(0, 2));
                VAL = VAL.slice(2);
                TLLEN += 2;
            } else if(lennum === 26) { // 4 byte len
                LEN = readBE81632(VAL.slice(0, 4));
                VAL = VAL.slice(4);
                TLLEN += 4;
            } else if(lennum === 26) { // 8 byte len
                throw new Error('UNABLE TO READ 8 BYTE LENGTHS')
            } else if(lennum === 31) { // indefinite length
                VAL = VAL;
                LEN = Infinity;
            } else {    
                throw new Error(`Found a length of ${lennum}. Length values 28-30(0x1C-0x1E) are reserved!`)
            }

            if(LEN !== Infinity)
                VAL = VAL.slice(0, LEN);
        }

        let TLVTOTALLEN = TLLEN + LEN;
        return {TAG, LEN, VAL, TLVTOTALLEN, TLLEN}
    }

    let bufferToString = (buffer) => {
        if(typeof Buffer !== 'undefined') //NodeJS decoding
            return buffer.toString('utf8');

        return new TextDecoder('UTF-8').decode(buffer);
    }

    let removeTagValue = (num) => {
        return num - (num & 32) - (num & 64) - (num & 128);
    }

    let bufferToHex = (buffer) => {
        return Array.from(buffer).map((num) => {
            if(num < 16)
                return '0' + num.toString(16)

            return num.toString(16)
        }).join('')
    }


    let arrayPairsToMap = (seq) => {
        let finalMap = {};
        let isKey  = true;
        let keyVal = '';
        for(let member of seq) {
            if(isKey)
               keyVal = member;
            else
                finalMap[keyVal] = member;

            isKey = !isKey;
        }

        return finalMap
    }

    let findLegthOfIndefiniteLengthBuffer = (buffer) => {
        for(let i = 0; i < buffer.length; i++) {
            if(buffer[i] === 0xff)
                return i + 1
        }
    }

    let decodeCborStream = (buffer, expectedLength) => {
        buffer = buffer.slice();
 
        let results    = [];
        let bLength    = 0;
        let workbuffer = buffer.slice();

        for(let i = 0; i < buffer.length; i++) {
            let tlv = getTLVForNext(workbuffer);

            let result = undefined;
            switch(tlv.TAG) {
                case 'UNSIGNED_INT':
                    if(tlv.TLLEN === 1)
                        result = tlv.VAL;
                    else if(tlv.TLLEN <= 5)
                        result = readBE81632(workbuffer.slice(1, tlv.TLLEN));
                    else
                        throw new Error('Ints over 4 bytes are not supported at this moment!');

                    results.push(result);
                    i += tlv.TLLEN - 1;
                break
                case 'NEGATIVE_INT':
                    if(tlv.TLLEN === 1)
                        result = -(1 + tlv.VAL);
                    else if(tlv.TLLEN <= 5)
                        result = -(1 + readBE81632(workbuffer.slice(1, tlv.TLLEN)));
                    else
                        throw new Error('Negative ints over 4 bytes are not supported at this moment!');

                    results.push(result);
                    i += tlv.TLLEN - 1;
                break
                case 'BYTE_STRING':
                    if(tlv.LEN === Infinity) {
                        let length = findLegthOfIndefiniteLengthBuffer(tlv.VAL);
                        result = tlv.VAL.slice(0, length);
                        i += length;
                    } else {
                        if(tlv.LEN === 0) {
                            result = workbuffer.slice(1, 1 + tlv.VAL)
                            i += tlv.VAL;
                        } else {
                            result = tlv.VAL;
                            i += tlv.TLVTOTALLEN - 1;
                        }
                    }

                    results.push(result);
                break
                case 'TEXT_STRING':
                    if(tlv.LEN === Infinity) {
                        let length = findLegthOfIndefiniteLengthBuffer(tlv.VAL);
                        result = tlv.VAL.slice(0, length);
                        i += length;
                    } else {
                        if(tlv.LEN === 0) {
                            result = workbuffer.slice(1, 1 + tlv.VAL)
                            i += tlv.VAL;
                        } else {
                            result = tlv.VAL;
                            i += tlv.TLVTOTALLEN - 1;
                        }
                    }

                    results.push(bufferToString(result));
                break
                case 'ARRAY':
                    result = decodeCborStream(workbuffer.slice(1), tlv.VAL)
                    if(result.length !== tlv.VAL)
                        throw new Error('SEQ missing elements!');

                    results.push(result)
                    i += result.byteLength;
                break
                case 'MAP':
                    result = decodeCborStream(workbuffer.slice(1), tlv.VAL * 2)
                    if(result.length !== tlv.VAL * 2 && !(tlv.LEN === Infinity && result.length % 2 === 0))
                        throw new Error('MAP is missing keypairs!');

                    results.push(arrayPairsToMap(result))
                    i += result.byteLength;
                break
                case 'OTHER_SEM':
                break
                case 'FLOAT_AND_NO_CONTENT':
                    let type = float_and_no_content_semantics[tlv.VAL];
                    switch(type) {
                        case "FALSE":
                            results.push(false);
                            i += 1;
                        break
                        case "TRUE":
                            results.push(true);
                            i += 1;
                        break
                        case "NULL":
                            results.push(null);
                            i += 1;
                        break
                        case "UNDEFINED":
                            results.push(undefined);
                            i += 1;
                        break
                        // case "SIMPLE_CONT":
                        // break
                        // case "FLOAT_16":
                        // break
                        // case "FLOAT_32":
                        // break
                        // case "FLOAT_64":
                        // break
                        case "INFINITY_BREAK":
                            i += 1;
                        break
                        default:
                            if(!type)
                                throw new Error(`VALUE ${tlv.VAL} IS UNASSIGNED`);

                            throw new Error(`${type} IS NOT CURRENTLY IMPLEMENTED!`);
                        break
                    }
                break
            }

            workbuffer = buffer.slice(i + 1)
            bLength    = i + 1; 

            if(expectedLength && results.length === expectedLength)
                break
        }

        results.byteLength = bLength;
        return results
    }

    let methods = {
        'decode': decodeCborStream,
        'decodeOnlyFirst': (buffer) => {
            return decodeCborStream(buffer, 1)
        },
        'encode': () => {
            throw new Error('NOT IMPLEMENTED YET')
        }
    }

    /**
     * Exporting and stuff
     */
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = methods;

    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                return methods
            });
        } else {
            window.vanillaCBOR = methods;
        }
    }
})()
