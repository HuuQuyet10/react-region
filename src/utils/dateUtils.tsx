import _ from 'lodash';
import moment from "moment";



export const disabledDateTime = (current) => {
    // nếu là ngày hiện tại, disable past time của ngày hôm dó, nếu là chọn ngày tương lai thì time picker hiện giờ từ 00:00

    if ((current && current.date() === moment().date()) || !current) {
        const disabledHours = () => {
            if (moment().isSame(current, 'day') || !current) {
                return [...Array(moment().hours())].map((_, i) => i);
            }
            return [];
        };
        const disabledMinutes = () => {
            if (moment().isSame(current, 'day') || !current) {
                return [...Array(moment().minutes())].map((_, i) => i);
            }
            return [];
        };
        const disabledSeconds = () => {
            if (moment().isSame(current, 'day') || !current) {
                return [...Array(moment().seconds())].map((_, i) => i);
            }
            return [];
        };

        return {disabledHours, disabledMinutes, disabledSeconds}
    }
    return {};
}









