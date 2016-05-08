
var express = require('express');
var AV = require('avoscloud-sdk');

var config = require('../config')

var router = express.Router();

AV.initialize( config.APP_ID, config.APP_Key);

var init_data = function(e){
    var d = {
        success : true
    }
    if ( e ) {
        d.success = false
        d.error = e
    }
    return d
}

var test_file = function(){

    var file = new AV.File('myfile.json', new Buffer('helloworld'))
    file.save().then(function(obj) {
      // 数据保存成功
      console.log(obj.url());
    }, function(err) {
      // 数据保存失败
      console.log(err);
    });
}

var save_file = function( data , cb){

    var map  = data['map']
    var name = data['name']


    var json = JSON.parse(map)
    var json_str = JSON.stringify( json, null,2)

    console.log( name )
    console.log( json_str)

    var file = new AV.File( name + '.json', new Buffer(json_str) )

    file.save().then(function(obj) {
        cb(null, obj)
    }, function(err) {
        cb(err, null)
    });

}

var test_data = function( d ){

    var TestObject = AV.Object.extend('TestObject');
    var testObject = new TestObject();
    testObject.save({
         testabc: 'abc123'
    }).then(function() {
         console.log('LeanCloud works!');
    }).catch(function(err) {
         console.log('error:' + err);
    });
}

var save_data = function( data , cb ){

    var callback = cb || function(){}

    var name = data['name']
    var acl = new AV.ACL()
        acl.setPublicReadAccess(true)
        acl.setPublicWriteAccess(true)
    var map = new AV.Object('Test_Map')
        map.set('name' , name)
        map.setACL(acl)

    var map_file = null

    var update_map = function( obj ){
        
        if ( obj ) {
            console.log( 'has map' , obj.id )
            // map = obj
            // 
            map = AV.Object.createWithoutData('Test_Map', obj.id)
        }

        if ( map_file ) {
            console.log( 'has file' )
            map.set('map', map_file)
            map.save().then(
                function(obj) {
                    callback(null, obj)
                },
                function(err) {
                    callback(err)
                }
            )
        }else{
            callback(1)
        }
    }

    var save_map = function(){
        find_one(name, update_map)
    }

    var file_back = function(err , obj){
        if (!err) {
            // console.log('save file ok ' , obj)
            map_file = obj
            save_map()
        }else{
            console.log(err)
            callback(err)
        }
    }

    save_file(data , file_back)

}

var find_one = function( name , cb ){
    var query = new AV.Query('Test_Map');
    query.equalTo('name', name);

    var callback = cb || function(a){
        console.log(a)
    }

    query.find().then(function(results) {
        console.log(results.length)

        var len = results.length

        if (len > 0) {
            var item = results[0]
            callback(item)
            console.log(len)
            // console.log(item)
        }else{
            callback(null)
        }
    })
}

var update_data = function(){

    var post = AV.Object.createWithoutData('Test_Map', '558e20cbe4b060308e3eb36c');
    // 更改属性
    post.set('content', '每个 JavaScript 程序员必备的 8 个开发工具: http://buzzorange.com/techorange/2015/03/03/9-javascript-ide-editor/');
    // 保存
    post.save().then(function() {
      // 保存成功
    }, function(error) {
      // 失败
    });
}




router.get('/', function(req, res, next) {
    
    find_one('第五关')
    var data = init_data(0)
    res.json(data)
});

router.post('/map', function(req, res, next) {

    var d = req.method = req.body

    var cb = function(err , obj){
        if (err) {
            console.log(err)
        }else{
            console.log(obj)
        }
    }

    save_data(d , cb)

    var data = init_data(0)
    res.json(data)

});

module.exports = router;
