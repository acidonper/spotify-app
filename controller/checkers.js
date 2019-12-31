const zxcvbn = require("zxcvbn");

const userItems = [
    "name",
    "lastname",
    "username",
    "email",
    "password",
    "agree"
];

const checkHttpLoginParams = params => {
    const keys = Object.keys(params);
    // Check email and password
    if (
        keys.length !== 2 ||
        !keys.includes("email") ||
        !keys.includes("password")
    )
        throw "Bad Parameters: email and password are only ones required";
};

const checkHttpParams = params => {
    const itemsExcluded = [];
    const itemsIncluded = [];
    const { password, agree } = params;
    const keys = Object.keys(params);

    if (!agree || agree !== "on") throw `Agreement required`;

    // Check valid and required params
    keys.map(item => {
        if (!userItems.includes(item)) {
            itemsExcluded.push(item);
        } else {
            itemsIncluded.push(item);
        }
    });
    if (itemsExcluded.length > 0)
        throw `Parameters not supported: ${itemsExcluded}`;
    if (itemsIncluded.length !== userItems.length)
        throw `Parameters required: ${userItems}`;

    // Check passwd
    if (zxcvbn(password).score < 2)
        throw `Your password must contain at least 8 characters (at least one uppercase, one number and one special character)`;
    // if (password.length < 3)
    //     throw `Password must comply with strong password rules`;
};

module.exports = { checkHttpParams, checkHttpLoginParams };
