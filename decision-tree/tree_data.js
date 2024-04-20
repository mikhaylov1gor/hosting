// Структура дерева
export class TreeNode {
    constructor(attribute, valClass) {
        this.attribute = attribute;
        this.class = valClass;
        this.children = [];
    }

    addChild(childNode) {
        this.children.push(childNode);
    }
}



