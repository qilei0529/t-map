
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

        hold_style : {
            left: '0px',
            top: '0px'
        },
        hover_style : {
            width: '0px',
            height: '0px'
        },
        pos_box : {
            x: 0,
            y: 0
        }
    },

    watch : {
        pos : function( newV , oldV){
            this.update_hold_pos(newV)
        },
        pos_box : function( newV , oldV){
            // this.update_hold_pos(newV)
            // console.log(newV)
        },
        size : function( newV){
            this.update_size( newV )
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
    },

    methods : {
        update_hold_pos : function( p ){
            var s = this.hold_style
            this.hold_style.left = -p.x * 30 + 'px'
            this.hold_style.top  = -p.y * 30 + 'px'
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
            this.hover_style.width = size.w * 30 + 'px'
            this.hover_style.height  = size.h * 30 + 'px'
        },

        on_click_box : function( x, y){
            console.log('click' , x, y)
            this.add_box( x, y)
        },

        on_mouse_down : function( e ){
            // console.log( e)
            var p = {
                x : parseInt(e.layerX / 30),
                y : parseInt(e.layerY / 30)
            }
            
            this.pos_box = {
                x : p.x,
                y : p.y
            }

            console.log('mouse down', p , this.pos_box )

            this.add_box( p.x , p.y)
        },

        on_mouse_move : function( e ){
            var p = {
                x : parseInt(e.layerX / 30),
                y : parseInt(e.layerY / 30)
            }

            var op = {
                x : this.pos_box.x,
                y : this.pos_box.y
            }

            if (p.x != op.x || p.y != op.y) {
                console.log( 'dif' , p , op)
                this.pos_box = p
            }

        },

        add_box : function( x, y ){
            var c = {
                data : {
                    x : x,
                    y : y
                },
                style : {
                    left : x * 30 + 'px',
                    top  : y * 30 + 'px'
                }
            }
            this.$set('case.c_' + x + '_' + y , c)
            console.log(this.case)
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



