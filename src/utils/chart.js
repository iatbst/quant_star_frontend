// ---------------------------- Line Chart ------------------------------------------ //

// 添加单line
// data_obj: key -> x axis, value -> y axis
export function addSingleLine(name, data_obj, options, reset_series=true, roundLevel=0, color=null){
    if (reset_series){
        options.series = [] 
    }
    var lineData = {name: name, data: []}
    if (color){
        lineData['color'] = color
    }
    if (Object.keys(data_obj).length > options.xAxis.categories.length){
        options.xAxis.categories = Object.keys(data_obj).sort()
    }
    
    // options.xAxis.categories = Object.keys(data_obj).sort()
    for (var i = 0; i < options.xAxis.categories.length; i++){
        var key = options.xAxis.categories[i]
        //lineData.data.push(Math.round(data_obj[key]))
        if (data_obj.hasOwnProperty(key)){
            lineData.data.push(Number(Number(data_obj[key]).toFixed(roundLevel))) 
        }
    }
    options.series.push(lineData)
}

// 添加双line(左右y轴表示不同的坐标)
// data_obj: key -> x axis, value -> y axis
// 目前存在未知bug: 当数据多时图表无法显示, 比如展示3年数据时
export function addTwoLine(name1, data_obj1, name2, data_obj2, options, reset_series=true, roundLevel=0){
    // debugger
    if (reset_series){
        options.series = [] 
    }

    // 选取数量多的为x轴
    if (Object.keys(data_obj1).length > Object.keys(data_obj2).length){
        options.xAxis.categories = Object.keys(data_obj1).sort()
    } else {
        options.xAxis.categories = Object.keys(data_obj2).sort()
    }

    // Line1
    var lineData1 = {name: name1, data: []}
    var floor1 = null
    var ceiling1 = null
    for(const key of Object.keys(data_obj1).sort()){
        lineData1.data.push([key, Number(Number(data_obj1[key]).toFixed(roundLevel))]) 
        if (floor1 == null || data_obj1[key] < floor1){
            floor1 = data_obj1[key]
        }
        if (ceiling1 == null || data_obj1[key] > ceiling1){
            ceiling1 = data_obj1[key]
        }
    }
    options.series.push(lineData1)
    options.yAxis[0].floor = floor1*0.99
    options.yAxis[0].ceiling = ceiling1*1.01

    // Line2: 使用右侧Y
    var lineData2 = {name: name2, data: [], yAxis: 1}
    var floor2 = null
    var ceiling2 = null
    for(const key of Object.keys(data_obj2).sort()){
        lineData2.data.push([key, Number(Number(data_obj2[key]).toFixed(roundLevel))])
        if (floor2 == null || data_obj2[key] < floor2){
            floor2 = data_obj2[key]
        }
        if (ceiling2 == null || data_obj2[key] > ceiling2){
            ceiling2 = data_obj2[key]
        } 
    }
    options.series.push(lineData2)
    options.yAxis[1].floor = floor2*0.99
    options.yAxis[1].ceiling = ceiling2*1.01

    // debugger
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

// 添加双columns(data1负责categories)
export function addTwoColumns(data_list1, data_list2, options) {
    options.xAxis.categories = []

    // col1
    options.series[0].data = []
    for (var i = 0; i < data_list1.length; i++){
        options.series[0].data.push({
            y: data_list1[i].y,
            color: data_list1[i].color,
            y2: data_list1[i].y2,   // y的另外一种呈现(eg, y是个位表示, y2是千位表示)
        })  
        options.xAxis.categories.push(data_list1[i].x)           
    }

    // col2
    options.series[1].data = []
    for (var i = 0; i < data_list2.length; i++){
        options.series[1].data.push({
            y: data_list2[i].y,
            color: data_list2[i].color,
            y2: data_list2[i].y2,   // y的另外一种呈现(eg, y是个位表示, y2是千位表示)
        })  
        // options.xAxis.categories.push(data_list2[i].x)           
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
export function addStackedColumn(data_obj, types, options, typeColors=null) {
    // 填充categories
    var xDatas = Object.keys(data_obj).sort()
    options.xAxis.categories = xDatas

    // series初始化
    options.series = []
    for(let i = 0; i < types.length; i++){
        if (typeColors === null){
            options.series.push({
                name: types[i],
                data: []
            })
        } else {
            // 不同type指定不同color
            options.series.push({
                name: types[i],
                data: [],
                color: typeColors[types[i]]
            })
        }
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

// 平台颜色
export const exchangeColors = {
    'binance': '#eeb00f',
    'okex': 'black'
}