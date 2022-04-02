// import React from "react";
// import { control, button } from 'react-validation';
// import { Fragment } from 'react';
// import ReactForm from 'react-bootstrap/Form';
// import ReactButton from 'react-bootstrap/Button';
// // import ReactSelect from 'react-select';
// import { Multiselect } from 'multiselect-react-dropdown';

// let selectStyle = {
//     "multiselectContainer": { // To change css for multiselect (Width,height,etc..)
//         "height": "60px",
//         "borderColor": "1px solid #D4D4D4",
//         "backgroundColor": "#fff",
//     },
//     "searchBox": { // To change search box element look
//         "border": "1px solid #D4D4D4",
//         //   "font-size": "10px",
//         "minHeight": "60px",
//     },
//     "inputField": { // To change input field position or margin
//         // "margin": "5px",
//     },
//     "chips": { // To change css chips(Selected options)
//         //   "background": "red",
//     },
//     "optionContainer": { // To change css for option container 
//         //   "border": "2px solid",
//     },
//     "option": { // To change css for dropdown options
//         //   "color": "blue",
//     }
// }
// // Define own Input component
// const Select = ({ error, isChanged, isUsed, ...props }) => (
//     <Fragment>
//         <Multiselect {...props} style={selectStyle} closeOnSelect={true} avoidHighlightFirstOption={true} />
//         {isChanged && isUsed && error}
//     </Fragment>
// );
// const Input = ({ error, isChanged, isUsed, ...props }) => (
//     <Fragment>
//         <ReactForm.Control {...props} />
//         {isChanged && isUsed && error}
//     </Fragment>
// );

// // Define own Button component
// const Button = ({ hasErrors, ...props }) => {
//     return (
//         <ReactButton {...props} ></ReactButton>
//     );
//     // <ReactButton {...props} disabled={hasErrors}></ReactButton>
// };

// export default { ...ReactForm, CustomControl: control(Input), CustomSelect: control(Select), CustomButton: button(Button) }
