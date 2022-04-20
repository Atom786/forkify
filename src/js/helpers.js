import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './configuration.js';

// Timeout
const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

//Getting data from api
export const getJSON = async function (url) {
    try {
        const response = await Promise.race([fetch(url), timeout(5)]); // Fetching data from api
        const data = await response.json(); // Converting into json format
        if (!response.ok) {
            throw new Error(`Invaild url : ${data.message} (${response.status})`);
        }
        return data;
    }
    catch (error) {
        throw error;
    }
};

// Sending data to api

export const sendJSON = async function (url, uploadingData) {
    try {
        const fetchRequest = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadingData),
        });
        const response = await Promise.race([fetchRequest, timeout(TIMEOUT_SECONDS)]); // Fetching data from api
        const data = await response.json(); // Converting into json format
        if (!response.ok) {
            throw new Error(`Invaild url : ${data.message} (${response.status})`);
        }
        return data;
    }
    catch (error) {
        throw error;
    }
};