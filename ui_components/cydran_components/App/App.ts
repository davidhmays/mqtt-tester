import TodoRepo from "../../../data/repo_localstorage";
// import {argumentsBuilder as args, PropertyKeys, Level, StageImpl, uuidV4, Component} from "./node_modules/cydran/dist/cydran.js";
// import cydran from "cydran"
import * as cydran from "cydran";

// const args = cydran.argumentsBuilder;
// const builder = cydran.builder;
// import { Builder as builder} from "cydran";
// const Component = cydran.Component;
import { Component } from "cydran";
// const PropertyKeys = cydran.PropertyKeys;
import { PropertyKeys } from "cydran";
// const Level = cydran.Level;
import { Level } from "cydran";
// const enumKeys = cydran.enumKeys;
import { enumKeys } from "cydran";

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
const uuidV4 = () => {
    const chars = CHARS;
    const uuid = new Array(36);
    let rnd = 0;
    let r = null;

    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid[i] = "-";
        } else if (i === 14) {
            uuid[i] = "4";
        } else {
            if (rnd <= 0x02) {
                rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
            }

            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join("");
};

class TodoListItem {
    constructor(id) {
        this.id = id;
        this.title = null;
        this.completed = false;
    }
}

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
