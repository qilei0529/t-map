
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
        case : {},
        case_d : {
            name: '1',
            data: {
                x: 1,
                y: 1,
                w: 1,
                h: 1
            },
            img : 'sprite-1'
        },
    },

    watch : {
        pos : function( newV , oldV){
            this.update_hold_pos(newV)
        },
        size : {
            handler : function( newV){
                this.update_size( newV )
            },
            deep: true
        },
        case_d : function( newV , oldV){
            this.update_case( newV , oldV )
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
    },

    methods : {
        init_key_bind : function(){
            var _this = this
            window.document.onkeydown = function(e){
                console.log(e.keyCode)
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

        update_hold_pos : function( p ){
            var s = this.hold_style
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
                img : '',
                focus : false,
                show  : true
            }

            var n = 'c_' + x + '_' + y
            c.name = n

            this.$set('case.' + n , c)

            this.case_d = this.$get('case.' + n)
            
            console.log('create: ',n)
        },

        update_case : function( c , o ){
            o.focus = false
            c.focus = true
        },

        on_click_case : function( m ){
            console.log(m)

            this.case_d = m
        },
        
        on_click_del : function(){
            this.case_d.show = false
            this.case_d = {}
        },

        box_style : function( m ){
            var s = {
                color : red
            }
            return s
        }
    }
}

// 启动vue
var vm_main = new Vue( main_config )

