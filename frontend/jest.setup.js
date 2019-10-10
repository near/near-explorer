const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
const jestDateMock = require("jest-date-mock");

Enzyme.configure({ adapter: new Adapter() });
jestDateMock.advanceTo(new Date(2019, 1, 1));
