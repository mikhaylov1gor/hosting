import {path, attributes, copyAttributes, isBypassing, inverseIsBypassing, showResult} from './settings.js'
import {timeout} from "./settings.js";

// Получение класса в начальном расположении атрибутов
function getClass(attribute){
    for (let i = 0; i < attributes.length; i++){
        if (attribute === copyAttributes[i]){
            return path[i];
        }
    }
}

// Обход дерева по заданному маршруту
export function treeBypassing(node) {
    document.getElementById(node.attribute).style.background = "#b7b7b7";
    document.getElementById(node.attribute).style.boxShadow = "0 0 5px #b7b7b7";

    if (node.children.length === 1) {
        setTimeout(() => {
            if (!isBypassing) {
                return false;
            }document.getElementById(node.attribute).style.background = "green";
            document.getElementById(node.attribute).style.boxShadow = "0 0 5px green";
            document.getElementById("leaf" + node.attribute).style.background = "green";
            document.getElementById("leaf" + node.attribute).style.boxShadow = "0 0 5px green";
            showResult(node.children[0].class);
            inverseIsBypassing();
            return true;
        }, timeout);
    } else {
        setTimeout(() => {
            if (!isBypassing) {
                return false;
            }
            let attribute = node.attribute;
            for (let i = 0; i < node.children.length; i++) {
                let child = node.children[i];
                if (child.class === getClass(attribute)) {
                    document.getElementById(node.attribute).style.background = "green";
                    document.getElementById(node.attribute).style.boxShadow = "0 0 5px green";
                    return treeBypassing(child);
                }
            }
            document.getElementById(node.attribute).style.background = "red";
            document.getElementById(node.attribute).style.boxShadow = "0 0 5px red";
            inverseIsBypassing();
            alert("Введите класс атрибута " + node.attribute + " корректно");
            return false;
        }, timeout);
    }
}