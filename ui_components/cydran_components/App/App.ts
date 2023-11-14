import TodoRepo from "../../../data/repo_localstorage";
// import {argumentsBuilder as args, PropertyKeys, Level, StageImpl, uuidV4, Component} from "./node_modules/cydran/dist/cydran.js";
// import cydran from "cydran"
import * as cydran from "cydran";

const args = cydran.argumentsBuilder;
const Component = cydran.Component;
const PropertyKeys = cydran.PropertyKeys;
const Level = cydran.Level;
const enumKeys = cydran.enumKeys;


const PERSONALIZED = "todo.person";
const DATA_SRLZ_LVL = "data.serialize.level";
const PROPERTIES = {
    [PropertyKeys.CYDRAN_LOG_LEVEL]: false,
    // [PropertyKeys.CYDRAN_STRICT_ENABLED]: false,
    [PropertyKeys.CYDRAN_STRICT_STARTPHRASE]: "Before software can be reusable it first has to be usable. (Ralph Johnson)",
    [`${PropertyKeys.CYDRAN_LOG_COLOR_PREFIX}.debug`]: "#00f900",
    [PropertyKeys.CYDRAN_LOG_LEVEL]: Level[Level.DEBUG],
    [PropertyKeys.CYDRAN_LOG_LABEL]: "ctdmvc",
    [PropertyKeys.CYDRAN_LOG_LABEL_VISIBLE]: false,
    [PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER]: "time:level:name",
    [PERSONALIZED]: "",
    [DATA_SRLZ_LVL]: Level[Level.TRACE],
};

const KEY_ENTER = "Enter";
const KEY_ESC = "Escape";
const TODO_CHANNEL = "TODOS";
const RMV_TODO = "removeTodo";
const UP_TODO = "updateTodo";
const template = (id) => document.querySelector(`template[id=${id}]`).innerHTML.trim();

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

class App extends Component {
    constructor() {
        super("<div>hi</div>");
    }
}

cydran
    .builder("body")
    // .withScopeItem("pluralize", (str, cnt) => (cnt !== 1 ? `${str}s` : str))
    .withPrototype(App.name, App, args().withProperty(PERSONALIZED).withInstanceId(11).build())
    // .withPrototype(TodoItem.name, TodoItem)
    .withInitializer((stage) => {
        stage.setComponentFromRegistry(App.name);
    })
    .build()
    .start();
