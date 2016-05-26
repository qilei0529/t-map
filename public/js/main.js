// 本地存储
var Storage = window.localStorage


// 共享数据
var Config = {
    data : {
        site : 'map.qilei.site'
    }
}


// 主要对象
var main_config = {
    el: '#main_app',
    data : {
        config : Config.data,
        version : 3,
        pos : {
            x : 0,
            y : 0
        },

        name : 'test',

        size : {
            w : 0,
            h : 0,
        },

        size_grid : {
            w : [],
            h : [],
        },

        hero : {
            x: 3,
            y: 7
        },

        layers : {

            stone : {
                case : {},
                cur  : {
                    data: {},
                    blank : true
                },
                type : [ 'stone' , 'round', 'float'],
                stack : [],
            },

            box   : {
                case : {},
                cur  : {
                    data: {},
                    blank : true
                },
                type : ['door', 'event' , 'case', 'trap'],
                stack : [],
            }

        },

        layer_cur : '',
        layer : {
            case : {},
            cur  : {
                data: {},
                blank : true
            },
            stack : [],
        },

        side_model : {
            ready : {
                name   : 'ready',
                flage  : false, 
                index  : -1,
                stack  : [],
                text    : ''
            },
            move : {
                name   : 'move',
                flage  : false, 
                index  : -1,
                stack  : [],
                text    : ''
            },
            action : {
                name   : 'action',
                flage  : false, 
                index  : -1,
                stack  : [],
                text : ''
            },
        },

        side_panel : {
            data : false,
            map  : false,
            case : false,
        },

        save_status : {
            save : 0, // 0 default, 1 doing , 2 ok , 3 error
            restore : 0,
            sync : 0
        },
    },

    watch : {
        size : {
            handler : function( newV){
                this.update_size( newV )
            },
            deep: true
        },

        'layer.stack' : function( newV , oldV ){
            if (newV.length > 10) {
                newV.splice(1,1)
            }
        },

        'layer_cur' : function( newV , oldV ){
            this.layer = this.layers[this.layer_cur]
        },

        'layer.cur' : function( newV , oldV ){
            if ( oldV ) {
                oldV.focus = false
            }
            newV.focus = true

        },

    },

    ready : function(){
        console.log('hello main vm')
        this.pos = {
            x : 10,
            y : 5
        }
        this.size = {
            w : 20,
            h : 10
        }

        this.layer_cur = 'stone'
        // this.layer = this.layers[this.layer_cur]
        this.init_key_bind()
        this.restore()

    },

    methods : {

        init_key_bind : function(){
            var _this = this
            window.document.onkeydown = function(e){
                // console.log(e.keyCode)
                var key = e.keyCode
                switch ( key ) {    
                    case 87 : // W
                        _this.pos.y += 1
                        break
                    case 83 : // S
                        _this.pos.y -= 1
                        break
                    case 65 : // A
                        _this.pos.x += 1
                        break
                    case 68 : // D
                        _this.pos.x -= 1
                        break
                }
            }
            console.log('init key bind')
        },

        update_size : function( size ){
            var s = this.size_grid
            s.w = []
            s.h = []

            for (var i = 0 ; i < size.w ; ++i) {
                s.w.push(i)
            }

            for (var i = 0 ; i < size.h ; ++i) {
                s.h.push(i)
            }
            console.log('update size' , size.w)
        },

        on_mouse_down : function( e ){
            // console.log( e)
            var p = {
                x : parseInt(e.layerX / 30),
                y : parseInt(e.layerY / 30)
            }
            
            this.add_box( p.x , p.y)
        },

        add_box : function( x, y ){
            var c = {
                data : {
                    x : x,
                    y : y,
                    w: 1,
                    h: 1
                },
                style : {
                    left : x * 30 + 'px',
                    top  : y * 30 + 'px'
                },
                type : this.layer.type[0],
                img : '',
                atlas : '',
                focus : false,
                show  : true,
                ready : [],
                action : [],
                move : [],
            }

            var n = 'c_' + x + '_' + y
            c.name = n

            var layer = this.layer
            this.$set('layer.case.' + n , c)
            layer.stack.push( layer.cur )
            layer.cur = this.$get('layer.case.' + n)
            console.log('create: ',n)
        },

        on_click_case : function( m ){

            var layer = this.layer
            if ( m.name != layer.cur.name ) {
                layer.stack.push( layer.cur )
                layer.cur = m
                console.log('focus: ',m.name)
            }

        },

        on_click_del : function(){

            var layer = this.layer
            layer.cur.show = false
            console.log('remove:' , layer.cur.name)
            if ( layer.stack.length > 2 ) {
                layer.cur = layer.stack.pop()
            }else{
                layer.cur = layer.stack[0]
            }

        },

        on_click_fold : function( d ){
            var panel = 'side_panel.' + d
            var flag = this.$get(panel)
            this.$set(panel , !flag)
        },

        on_change_layer : function( n ){
            this.layer_cur = n
        },

        // move
        on_click_action : function( m , i, a){
            console.log('show move panel')
            m.index = i
            m.text  = JSON.stringify( a , null,2)
            m.box   = this.layer.cur
            m.flag  = true
        },
        on_del_action : function( m , i){
            console.log('del ', i)
            // console.log(m)
            m.splice(i, 1)
        },

        on_move_add : function(){
            console.log('add move')

            if ( this.layer.cur.move ) {
                var move = this.layer.cur.move
                var a = {
                    "name"   : "move",
                    "repeat" : 1 ,
                    "step" : [
                        {
                            "event" : "move",
                            "dur"   : 2,
                            "x": -2,
                            "y": 0,
                        },
                        {
                            "event" : "wait",
                            "dur"  : 2
                        },
                        {
                            "event" : "move",
                            "dur"   : 2,
                            "x": 2,
                            "y": 0,
                        },
                        {
                            "event" : "wait",
                            "dur"  : 2
                        }
                    ],
                }
                move.push( a )
            }

        },

        // action
        on_ready_add : function(){
            console.log('add action')
            if ( this.layer.cur.ready ) {
                var action = this.layer.cur.ready
                var a = {
                    event : 'move'
                }
                action.push( a )
            }
        },

        // action
        on_action_add : function(){
            console.log('add action')
            if ( this.layer.cur.action ) {
                var action = this.layer.cur.action
                var a = {
                    event : 'show'
                }
                action.push( a )
            }
        },

        box_style : function( m ){
            var s = {
                color : red
            }
            return s
        },

        save : function(){

            var key = this.save_status.save 
            if ( key == 1 ) {
                return
            }
            var _this = this
            this.save_status.save = 1

            var t = JSON.stringify( this.$data, null,2)

            console.log(t)

            Storage.setItem('data' , t)

            var save_ok = function(){
                _this.save_status.save = 0
            }

            var timer = setTimeout(save_ok, 100)

        },

        sync : function(){
            console.log('sync')

            if (this.save_status.sync == 1) {
                return
            }

            var url = "./c/map"
            var data = {
                name : this.name,
                map : this.format_data()
            }

            var _this = this

            _this.save_status.sync = 1

            var cb = function( a, b ){
                console.log( a, b)
                _this.save_status.sync = 0
            }
            console.log(data)
            do_post(url , data , cb)

        },

        // format map data
        format_data : function(){

            var t = JSON.stringify( this.$data, null,2)
            var d = JSON.parse(t)

            var map = {
                name : d.name,
                texture : ['hero'],
                size : d.size,
                hero : {
                    x: 2,
                    y: 3
                },
                layer : [],
                map   : [],
                ready : {},
                stone : [],
                box   : []
            }

            var stone = []

            for ( n in d.layers ) {
                var layer = d.layers[n]

                var name = n
                var cases = []

                for ( c in layer.case ) {
                    var s = layer.case[c]
                    // console.log(c)
                    var item = {
                        name : s.name,
                        type : s.type,
                        x : parseInt(s.data.x),
                        y : parseInt(this.size.h) - parseInt(s.data.y) - parseInt(s.data.h),
                        w : parseInt(s.data.w),
                        h : parseInt(s.data.h),
                        motion : [],
                        action : [],
                        init : []
                    }

                    console.log(s)

                    if ( s.img ) {
                        item.img = s.img
                    }

                    if ( s.atlas ) {
                        item.group = s.atlas
                    }

                    if ( s.move ) {
                        item.motion = s.move
                    }

                    if ( s.action ) {
                        item.action = s.action
                    }

                    if ( s.ready ) {
                        item.init = s.ready
                    }

                    if (s.show) {
                        cases.push(item)
                    }

                    // console.log(item)
                }

                map[name] = cases
            }

            console.log(map)
            var out = JSON.stringify(map)
            t = null
            d = null
            map = null
            // console.log(d)
            return out
        },

        clean : function(){
            console.log('clean')
            for ( n in this.layers ) {

                var layer = this.$get('layers.' + n)

                // case
                layer.case = {}

                // stack
                layer.stack = []

                // re cur
                layer.cur = {
                    data: {},
                    blank : true
                }

                layer.stack.push(layer.cur)
            }

        },

        restore : function(){
            var t = Storage.getItem('data')
            if ( t == null ) {
                return
            }

            var json = JSON.parse(t)

            var v = this.version

            var v_new = json.version || 0

            if ( v != v_new ) {
                Storage.removeItem('data')
                return
            }

            this.$data = json
            this.save_status.save = 0

            this.clear_case_cur()
            this.layer = this.layers[this.layer_cur]
        },

        clear_case_cur : function(){
            console.log('clear cur')
            for ( n  in this.layers ) {
                var layer = this.$get('layers.' + n)
                layer.stack = []

                var name = layer.cur.name || null

                for (c in layer.case ) {

                    var caa = layer.case[c]

                    caa.focus = false

                    // console.log(caa)
                }

                // re cur
                layer.cur = {
                    data: {},
                    blank : true
                }

                layer.stack.push(layer.cur)
            }
        }
    }
}


var do_post = function(url, data, cb){
    $.ajax({
        type: "post",
        url : url,
        dataType: "json",
        data: data || {},
        success: cb || function (e) { console.log(e)},
        error: function (e) { console.log(e)}
    })
}

var side_float_config = {
    template: '#ds_action_float',
    props: ['data'],
    data: function () {
        return {
            error : null,
            flag : false
        }
    },
    watch : {
        data : {
            handler : function( newV ){
                var d = newV
                this.flag = this.data.flag
            },
            deep: true
        },
        'data.text' : function( newV ){
            this.save()
        }
    },
    methods: {
        clear : function(){
            console.log('clear' , this.data.name)
            this.flag = this.data.flag = false
        },

        save : function(){
            console.log('save' , this.data.name)
            var name = this.data.name
            var box  = this.data.box 
            var i    = this.data.index
            var data = ''

            var text = this.data.text
            var json = null

            try {
                json = JSON.parse(text)
                this.error = null
                if ( box ) {
                    switch ( name ) {
                        case  'move':
                            box.move.splice( i , 1 , json )
                            break
                        case  'action':
                            ac = box.action
                            box.action.splice( i , 1 , json )
                            break
                        case  'ready':
                            ac = box.action
                            box.ready.splice( i , 1 , json )
                            break
                        default : 
                            break 
                    }
                }

                console.log(box.move)
            }   
            catch(e){   
                console.log( e )
                this.error = 'error format'
            }
        }
    }
}

// 注册组件
Vue.component('side-float', side_float_config)

// 启动vue
var vm_main = new Vue( main_config )

