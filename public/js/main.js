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
        pos : {
            x : 0,
            y : 0
        },
        size : {
            w : 0,
            h : 0,
        },
        size_grid : {
            w : [],
            h : [],
        },

        layers : {
            stone : {},
            case  : {}
        },

        // case
        case : {},
        case_d : {
            data: {},
            blank : true
        },
        case_stack : [],
        case_type : ['round', 'stone'],

        side_panel : {
            data : false,
            map  : true,
            case : false,
        },

        save_status : {
            save : 0, // 0 default, 1 doing , 2 ok , 3 error
            restore : 0
        }

    },

    watch : {
        size : {
            handler : function( newV){
                this.update_size( newV )
            },
            deep: true
        },
        case_d : function( newV , oldV){
            oldV.focus = false
            newV.focus = true
            // save on change
            // this.save()
        },
        case_stack : function( newV , oldV){
            if (this.case_stack.length > 10) {
                this.case_stack.splice(1,1)
            }
        }
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
                type : 'stone',
                img : '',
                focus : false,
                show  : true
            }

            var n = 'c_' + x + '_' + y
            c.name = n

            this.$set('case.' + n , c)
            this.case_stack.push( this.case_d )
            this.case_d = this.$get('case.' + n)
            console.log('create: ',n)
        },

        on_click_case : function( m ){

            if ( m.name != this.case_d.name ) {
                this.case_stack.push( this.case_d )
                this.case_d = m
                console.log('focus: ',m.name)
            }

        },

        on_click_del : function(){
            this.case_d.show = false
            console.log('remove:' , this.case_d.name)

            if ( this.case_stack.length > 2 ) {
                this.case_d = this.case_stack.pop()
            }else{
                this.case_d = this.case_stack[0]
            }

        },

        on_click_fold : function( d ){
            var panel = 'side_panel.' + d
            var flag = this.$get(panel)
            this.$set(panel , !flag)
        },

        box_style : function( m ){
            var s = {
                color : red
            }
            return s
        },

        save : function(){
            var t = JSON.stringify( this.$data, null,2)
            Storage.setItem('data' , t)
            // console.log(t)
        },

        restore : function(){
            var t = Storage.getItem('data')
            // console.log(t)
            // console.log()
            console.log( t )
            if ( t == null ) {
                return
            }

            var json = JSON.parse(t)
            this.$data = json

            var case_d = {
                data: {},
                blank : true
            }

            // repand case_d
            var name = this.case_d.name
            this.case_d = this.$get('case.' + name)
            // empty stack
            this.case_stack = [case_d , this.case_d]
        }
    }
}

// 启动vue
var vm_main = new Vue( main_config )

