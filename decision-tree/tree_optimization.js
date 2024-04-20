// Функция оптимизации дерева (удаление ненужных ветвей и листьев)
export function treeOptimization(node){
    if (node.children.length === 1){
        return node.children[0].class;
    }

    let ends = [];
    for (let i = 0; i < node.children.length; i++){
        ends.push(treeOptimization(node.children[i]));
    }

    for (let i = 0; i < ends.length - 1; i++){
        for (let j = i + 1; j < ends.length; j++){
            if (ends[i] !== ends[j]){
                return ends;
            }
        }
    }

    node.addChild(node.children[0].children[0]);
    node.attribute = node.children[0].attribute;
    while (node.children.length > 1){
        node.children.shift();
    }
    return node.children[0].class;
}