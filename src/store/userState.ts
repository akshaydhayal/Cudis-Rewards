import { atom } from "recoil";

// Atom for user information
export const userState = atom({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const userCount=atom({
    key:"userCount",
    default:0
})
