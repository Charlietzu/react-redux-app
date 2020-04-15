import { configure } from "enzyme";
/**This configures Enzyme to work with React 16 */
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
