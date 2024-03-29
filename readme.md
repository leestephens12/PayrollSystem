# Payroll System

## Description

This is a payroll system for a company to use to manage their employees shifts and  paystub generation.
It will calculate the pay based on their clocked in hours and standard (Canadian) deductions (EI, etc.).

## Table of Contents

- [Payroll System](#payroll-system)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Self-hosting](#self-hosting)
  - [Development](#development)
    - [Documentation](#documentation)
  - [License](#license)

## Installation

no install required, simply use the [webapp]() @ <>

## Usage

navigate to <> and enter your given employee id to begin.

### Self-hosting


clone the repository and download the required npm packages

```cmd
git clone https://github.com/leestephens12/PayrollSystem &&
cd PayrollSystem &&
npm install
```

setup up a [firebase]() project for this project and link it with firestore and authentication.

deploy the project locally by running

```cmd
npm run start
```

and open the development site at <http://localhost:3000/index>

## Development

![Vercel Badge](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff&style=for-the-badge)
![ESLint Badge](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff&style=for-the-badge)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge)
![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)
![Firebase Badge](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=000&style=for-the-badge)
![Handlebars.js Badge](https://img.shields.io/badge/Handlebars.js-000?logo=handlebarsdotjs&logoColor=fff&style=for-the-badge)

### Documentation

- [Firebase](https://firebase.google.com/docs/firestore/quickstart?hl=en): <https://console.firebase.google.com/u/0/project/payrollsystem-1b6ee/settings/iam>
- GitHub: <https://github.com/leestephens12/PayrollSystem>
- [Vercel](https://vercel.com/docs/getting-started-with-vercel): tbd
- SRS: [Payroll Software Requirements Specification](https://docs.google.com/document/d/1giVTS3RIsNKzhANURo-H77hj-Rq5daoU/edit#heading=h.gjdgxs)
- Sequence Diagram: <https://lucid.app/lucidchart/3e94d423-3ec4-4059-aade-7a82b7970dcd/edit?viewport_loc=-11%2C-10%2C1365%2C620%2C0_0&invitationId=inv_b583a483-bbed-482a-8c21-20ddda2f2b87>
- UML diagram: <https://lucid.app/lucidchart/121148a4-ae9d-426d-b5a6-acb289d6110e/edit?invitationId=inv_24cce35c-814c-477d-ad32-3be9d698c704>
- Project Management site: <https://op.hapticsandrobots.com/>
- Demo of Javascript Classes: <https://github.com/Mason8766/COMP3415-PAYROLLSYSTEM>
- Activity and State Diagrams: <https://lucid.app/lucidchart/a12f42d5-a4b1-4aa8-ae02-7a04eae1dacf/edit?invitationId=inv_07540c9b-309b-45a7-8fef-14f70ec3a0c6&page=PRUKoQfZuS71#>
- additional information: <https://docs.google.com/document/d/1uPTWgbt_LG_d0FhGpM66EuHW7a9nXMnZIhObXgyXPNw/>


All related types and classes should be sufficiently annotated using [jsdoc](https://jsdoc.app/).

## License

[no license](https://choosealicense.com/no-permission/)
