import passwordValidator from './password-validator';
import imageValidator from './image-validator';
import phoneValidator from './phone-validator';
import codeValidator from './code-validator';
import moneyFormator from './money-format';
import disableTime from './disable-time';
import numberValidator from './number-validator';
let utils = {
    passwordValidator,
    imageValidator,
    phoneValidator,
    codeValidator,
    moneyFormator,
    disableTime,
    numberValidator
};
export {
    utils as default,
    passwordValidator,
    imageValidator,
    phoneValidator,
    codeValidator,
    moneyFormator,
    disableTime,
    numberValidator
}