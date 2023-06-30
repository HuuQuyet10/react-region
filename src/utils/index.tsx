import _ from 'lodash';
import {sprintf, vsprintf} from 'sprintf-js';

import * as Constants from '../constants';
import {default as moment} from 'moment';
import {notification} from 'antd';
import {NotificationType} from "../constants";
import {store} from "../core/app.store";
import {JobTypeItemResponse} from "../core/jobType/models";
import {UserDetailResponse} from "../core/user/models";
import {OptionModel} from "../models";
import {RouteConfig} from "../routes/config/PrivateRoutesConfig";
import numeral from 'numeral';

const {CurrencyKey} = Constants;

export const safeParseInt = strNumber => {
    let numParse = 0;
    if (strNumber === '' || strNumber === null || strNumber === undefined) {
        return numParse;
    }

    numParse = _.parseInt(strNumber);
    if (numParse === null || _.isNaN(numParse)) {
        numParse = 0;
    }

    return numParse;
};

export const safeParseFloat = strNumber => {
    let numParse = 0;
    if (strNumber === '' || strNumber === null || strNumber === undefined) {
        return numParse;
    }

    numParse = parseFloat(strNumber);
    if (numParse === null) {
        numParse = 0;
    }

    return numParse;
};

export const getDeviceLocale = currencyCode => {
    if (currencyCode.toUpperCase() === CurrencyKey.KEY_VND.toUpperCase()) {
        return 'vi-VN';
    }
    return 'en-US';
};
export const backTop = () => {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
};

export const safeParseJson = jsonValue => {
    let objParsed = {};

    if (jsonValue && jsonValue !== '' && typeof jsonValue === 'string' && jsonValue !== null) {
        objParsed = JSON.parse(jsonValue);
    }
    return _.isObject(objParsed) ? objParsed : {};
};

export const safeParseListJson = jsonValue => {
    let objParsed = [];
    if (jsonValue && jsonValue !== '' && typeof jsonValue === 'string' && jsonValue !== null) {
        objParsed = JSON.parse(jsonValue);
    }

    return _.isArray(objParsed) ? objParsed : [];
};

export const replaceStrUrl = (baseUrl, arrStr) => {
    let path = vsprintf(baseUrl, arrStr);
    return path;
};

export const getDateInTimeStamp = (date) => {
    const dateTimestamp = moment(date).format('x');
    return dateTimestamp;

};

export const getSafeValue = (object, keyItem, defaultValue) => {
    let safeValue = _.get(object, keyItem, defaultValue);
    if (safeValue === null) {
        safeValue = defaultValue;
    }

    if (safeValue === '') {
        safeValue = defaultValue;
    }
    if (
        safeValue !== null &&
        defaultValue !== null &&
        (typeof safeValue !== typeof defaultValue || safeValue.constructor !== defaultValue.constructor)
    ) {
        safeValue = defaultValue;
    }

    // console.log("safeValue", safeValue);

    return safeValue;
};

export const convertCurrency = (value, currencyCode = 'VND') => {
    const val = safeParseFloat(value);
    const valueRound = Math.round(val * 100) / 100;
    const currencyDefault = CurrencyKey.KEY_USD;

    const locale = getDeviceLocale(currencyCode || currencyDefault);

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode || currencyDefault,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(valueRound);
};

export const currencyFormat = currencyCode => {
    const currencyDefault = CurrencyKey.KEY_USD;
    const locale = getDeviceLocale(currencyCode || currencyDefault);
    // just a number with thousand group and fraction
    const numberWithDecimalSeparator = 10000.11;

    return Intl.NumberFormat(locale).formatToParts(numberWithDecimalSeparator);
};

export function numberWithCommas(number: number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const getCurrencySymbol = currencyCode => {
    const currencyDefault = CurrencyKey.KEY_USD;
    const locale = getDeviceLocale(currencyCode || currencyDefault);
    const sourceCurrency = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode || currencyDefault,
    }).formatToParts();
    const arrCurrency = sourceCurrency.filter(obj => {
        if (obj.type === 'currency') {
            return obj;
        }
    });
    const objCurrency = arrCurrency[0];
    return objCurrency.value;
};

export const formatNumber = (value, currencyCode?) => {
    const val = safeParseFloat(value);
    const valueRound = Math.round(val * 100) / 100;
    const currencyDefault = CurrencyKey.KEY_USD;

    const locale = getDeviceLocale(currencyCode || currencyDefault);

    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        currency: currencyCode || currencyDefault,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valueRound);
};

export const formatNumberVNI = (number: number) => {
    return numeral(number).format('0,0.[00]')
}


export const safeParseDate = (value: string, format = 'YYYY-MM-DD') => {
    const date = moment(value, format).toDate();
    const isValid = moment(date).isValid();
    return (isValid && date) || undefined;
};
export const convertDateFormat = (value: string, fromFormat: string, toFormat: string): string => {
    const date = moment(value, fromFormat);
    return date.isValid() ? date.format(toFormat) : '';
};


export function getRoutesFromConfig(routes: RouteConfig[]) {
    const totalRoute: RouteConfig[] = routes.reduce((accu: RouteConfig[], cur: RouteConfig) => {
        if (!cur.children) {
            return [...accu, cur];
        } else {
            return [...accu, ...cur.children];
        }
    }, []);

    const allowRouter: RouteConfig[] = totalRoute.filter((item: RouteConfig) => {
        if (!item.permission || hasPermission(item.permission)){
            return item;
        }
    });

    return allowRouter;
}

export function getMenuFromConfig(routes) {
    const res: any = [];

    routes.forEach(route => {
        const tmp = {...route};
        if (tmp.children) {
            tmp.children = getMenuFromConfig(tmp.children);
        }
        if (tmp.isMenu && (!tmp.permission || hasPermission(tmp.permission))) {
            res.push(tmp);
        }

    });
    return res;
}

export function getFileNameFromUrlDownload(urlDownload: string) {
    // check url của upload trả về có kí tự "/" hay ko, nếu có thì split lấy lấy phần tử thứ 2, nếu ko thì trả về url origin
    if (urlDownload.includes('/')) {
        const splitUrl = urlDownload.split("/");
        return splitUrl[1];
    } else {
        return urlDownload;
    }

}


export function hexdec(hexString) {
    hexString = (hexString + '').replace(/[^a-f0-9]/gi, '');
    return parseInt(hexString, 16);
}

export function getBrightness(hexColor) {
    if (hexColor.toLowerCase() == 'transparent') {
        return '129';
    }

    hexColor = hexColor.replace('#', '');

    if (hexColor.length == 3) {
        hexColor += hexColor;
    }

    let $r = hexdec(hexColor.substr(0, 2));
    let $g = hexdec(hexColor.substr(2, 2));
    let $b = hexdec(hexColor.substr(4, 2));

    return (($r * 299) + ($g * 587) + ($b * 114)) / 1000;
}


export function hasPermission(permission: string[]) {
    const storeRedux = store.getState();
    const listPermisions = storeRedux.curUserLogin.listPermisions.data;

    return listPermisions.some(item => permission.includes(item));
}


export const getJobTypeNameFromValue = (jobTypeId: number, listJobType: JobTypeItemResponse[]) => {

    const selectedJobType = listJobType?.find((option) => option.id === jobTypeId);
    return selectedJobType ? `${selectedJobType?.code} - ${selectedJobType?.name}` : '';
};


export const getUsernameFromId = (userId: number, listUser: OptionModel[]) => {

    const selectedJobType = listUser?.find((option) => option.value === userId);
    return selectedJobType ? `${selectedJobType?.label}` : '';
};

export function mapOptions<T = string>(data: any[]): OptionModel[] {
    return data.map((x) => ({ value: x.id, label: x.name }));
}

export const showNofi = (type: NotificationType, message, duration: number = 5, key?: string) => {
    notification[type]({
        message: '',
        description: message,
        duration: duration,
        key: key,
    });
};



export const deleteNullProp = (obj: any) => {
    for (const prop in obj) {
        if (obj[prop] == null || obj[prop]?.length === 0) {
            delete obj[prop];
        }
    }
    return obj;
}

