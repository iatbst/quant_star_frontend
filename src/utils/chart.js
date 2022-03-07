// ---------------------------- Line Chart ------------------------------------------ //

// 添加单line
// data_obj: key -> x axis, value -> y axis
export function addSingleLine(name, data_obj, options){
    options.series = []
    var lineData = {name: name, data: []}
    options.xAxis.categories = Object.keys(data_obj).sort()

    for (var i = 0; i < options.xAxis.categories.length; i++){
        var key = options.xAxis.categories[i]
        lineData.data.push(Math.round(data_obj[key]))
    }
    options.series.push(lineData)
}

// 添加xAixs (用于多line Chart)
export function addMultiLineX(data_obj, options){
    var insertKey = false
    if (options.xAxis.categories.length == 0){
        // 初始化
        options.xAxis.categories = Object.keys(data_obj).sort()
    } else {
        for (let key in data_obj){
            if (options.xAxis.categories.indexOf(key) == -1){
                // 新数据
                options.xAxis.categories.push(key)
                insertKey = true
            }
        }
        if (insertKey) {
            options.xAxis.categories = options.xAxis.categories.sort()  // 添加key后需要sort
        }                
    }
}

// 添加LineData (用于多line Chart)
export function addMultiLine(name, data_obj, options){
    var lineData = {name: name, data: []}
    for (var i = 0; i < options.xAxis.categories.length; i++){
        var key = options.xAxis.categories[i]
        if (data_obj.hasOwnProperty(key)){
            lineData.data.push(Math.round(data_obj[key]))
        } else {
            lineData.data.push(null)
        }
    }
    options.series.push(lineData)
}

// ---------------------------- Column Chart ------------------------------------------ //

// 添加单column
export function addSingleColumn(data_list, options) {
    options.xAxis.categories = []
    options.series[0].data = []
    for (var i = 0; i < data_list.length; i++){
        options.series[0].data.push({
            y: data_list[i].y,
            color: data_list[i].color
        })  
        options.xAxis.categories.push(data_list[i].x)           
    }
}

// 添加clickable column
export function addSingleClickableColumn(data_list, options, onClick, onClickData='onClickData') {
    options.xAxis.categories = []
    options.series[0].data = []
    for (var i = 0; i < data_list.length; i++){
        options.series[0].data.push({
            y: data_list[i].y,
            color: data_list[i].color,
            onClickData: data_list[i][onClickData]
        })  
        options.xAxis.categories.push(data_list[i].x)           
    }
    options.plotOptions['series'] = {
        cursor: 'pointer',
        point: {
            events: {
                click: function (){
                    // alert(JSON.stringify(this.pfoDatas, null, 4));
                    onClick(this.onClickData)
                }
            }
        }
    }
}

// 添加stacked column
// types: series.names
// data_obj: keys -> categories, values -> {type1: xxx, type2: xxx, type3: xxx ...}
// 注意: values可能没有全部types, 对应的data需要填充0; keys需要sort
export function addStackedColumn(data_obj, types, options) {
    // 填充categories
    var xDatas = Object.keys(data_obj).sort()
    options.xAxis.categories = xDatas

    // series初始化
    options.series = []
    for(let i = 0; i < types.length; i++){
        options.series.push({
            name: types[i],
            data: []
        })
    }

    for(let i = 0; i < xDatas.length; i++){
        for(let j = 0; j < types.length; j++){
            if (data_obj[xDatas[i]].hasOwnProperty(types[j])){
                options.series[j].data.push(data_obj[xDatas[i]][types[j]])
            } else {
                options.series[j].data.push(null)  // 填充0
            }
        }       
    }
}

export function clearStackedColumn(options) {
    options.xAxis.categories = []
    options.series = []
}

// ---------------------------- Pie Chart ------------------------------------------ //

// 填充Pie Chart
export function fillPie(data_obj, options) {
    options.series[0].data = []
    for (let name in data_obj) {
        options.series[0].data.push({
            name: name,
            y: data_obj[name]
        })
    }
}

export function fillPieByArray(data_list, options) {
    options.series[0].data = []
    for (var i = 0; i < data_list.length; i++){
        options.series[0].data.push(data_list[i])
    }
}