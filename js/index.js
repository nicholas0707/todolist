function loadData() {
    //取出储存的数据
    var todoData = localStorage.getItem("todoList");
    if (todoData != null) {
        return JSON.parse(todoData);
    }
    else return false;
}

function saveData(data) {
    //储存数据
    localStorage.setItem("todoList", JSON.stringify(data));
}

function update(num, content, boolean) {
    //更新修改的数据
    var dataList = loadData();
    for (var i = 0; i < dataList.length; i++) {
        if (dataList[i]["id"] == num) {
            dataList[i]["content"] = content;
            dataList[i]["done"] = boolean;
        }
    }
    saveData(dataList);
}

function removeData(num, flag) {
    //移除部分或者全部数据
    if (!flag) {
        var dataList = loadData();
        for (var i = 0; i < dataList.length; i++) {
            if (dataList[i]["id"] == num) {
                var index = dataList.indexOf(dataList[i]);
                dataList.splice(index, 1);
            }
        }
        saveData(dataList);
    } else {
        localStorage.clear();
        location.reload();
    }
}

function finishOrNot(num) {
    //切换完成状态或未完成状态
    var pObj = my$("p-" + num);
    var liObj = pObj.parentElement;
    var parentOlObj = liObj.parentElement;
    var stateWord = parentOlObj.getAttribute("id");
    var checkboxObj = liObj.firstElementChild;
    if (checkboxObj.checked) {
        if (stateWord == "todoList") {
            my$("todoList").removeChild(liObj);
            liObj.className = "done";
            my$("doneList").appendChild(liObj);
            update(num, pObj.innerHTML, true)
        }
    } else {
        if (stateWord == "doneList") {
            my$("doneList").removeChild(liObj);
            liObj.className = "";
            my$("todoList").appendChild(liObj);
            update(num, pObj.innerHTML, false)
        }
    }
}

function edit(num) {
    //编辑某项任务的具体内容
    var oldPobj = my$("p-" + num);
    var content = oldPobj.innerHTML;
    var liObj = oldPobj.parentElement;
    var newPobj = oldPobj;
    if (!my$("input-" + num)) {
        newPobj.innerHTML = "<input id='input-" + num + "' value='" + content + "' />";
        var inputObj = my$("input-" + num);
        inputObj.onblur = function () {
            if (inputObj.value == content) {
                newPobj.innerHTML = content;
            } else {
                newPobj.innerHTML = inputObj.value;
                var boolean = liObj.parentElement.getAttribute("id") == "todoList" ? false : true;
                //确定添加的是完成还是未完成的事项
                update(num, newPobj.innerHTML, boolean);
            }
        }
    }
}

function clear(num) {
    //移除某项任务
    var currentObj = my$("clear-" + num);
    var liObj = currentObj.parentElement;
    var parentOlObj = liObj.parentElement;
    parentOlObj.removeChild(liObj);
    removeData(num, false)
}

function addLi(id, content, boolean) {
    //添加任务的具体情况
    var todoOL = my$("todoList");
    var doneOL = my$("doneList");
    var newLiObj = document.createElement("li");
    newLiObj.id = "newLi";
    newLiObj.innerHTML = "<input type='checkbox' name='' class='checkbox' onchange = 'finishOrNot(" + id + ")' ><p id='p-" + id + "'  onclick='edit(" + id + ")' >" + content + "</p><a href='javascript:clear(" + id + ")' id='clear-" + id + "' class='clear'><img src='images/删除.png' alt=''></a>";
    if (!boolean) {
        todoOL.appendChild(newLiObj);
    } else {
        newLiObj.className = "done";
        var checkboxObj = newLiObj.firstElementChild;
        checkboxObj.checked = true;
        doneOL.appendChild(newLiObj)
    }

}

function addEvent(todoCount, dataList) {
    //新增要做的事项
    my$("addList").onkeydown = function (e) {
        if (e.keyCode == 13) {
            var newAddList = my$("add").value.trim();
            if (newAddList) {
                my$("add").value = "";
                my$("add").placeholder = "添加要做的事";
                addLi(todoCount, newAddList, false);
                var newData = {"content": newAddList, "done": false, "id": todoCount};
                dataList.push(newData);
                saveData(dataList);
                todoCount++;
                return false;
            }
        }
    };
}

window.onload = function load(ev) {
    var todoCount;
    var dataList = loadData();
    if (dataList) {
        var idList = [];
        for (var i = 0; i < dataList.length; i++) {
            var workState = dataList[i]["done"];
            var id = dataList[i]["id"];
            idList.push(id);
            var content = dataList[i]["content"];
            if (workState) {
                addLi(id, content, true);
            } else {
                addLi(id, content, false);
            }
        }
        var maxId = Math.max.apply(Math, idList);
        todoCount = maxId + 1;//获得最大的事件id
    } else {
        dataList = [];
        todoCount = 1;
    }
    addEvent(todoCount, dataList);
};