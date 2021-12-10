var db = require('./db');
reqBodySchema = db.reqBodySchema;

//개인기술스택 처리

//대분류 기술목록 가져오기
exports.getTitle = function(req,res){
    var sql = 'select * from TITLE '

    db.getConnection((conn)=>{
        conn.query(sql,function(err,titles){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                res.status(200); 
                res.json({titles}); //결과 보냄  
            }
        });
        conn.release();
    });
}

//대분류에 맞는 소분류 기술목록 가져오기
exports.getTech = function(req,res){
    var title_num = req.params.title_num;
    var sql = 'select * from POSITION where title_num = ?'

    db.getConnection((conn)=>{
        conn.query(sql,title_num,function(err,positions){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                res.status(200); 
                res.json({positions}); //결과 보냄  
            }
        });
        conn.release();
    });
}

//내 기술목록 가져오기. 프로필정보에서 사용.
exports.getMyTech = function(req,res){
    var uid = req.params.id;
    var sql = 'select * from STACK where uid = ?'

    db.getConnection((conn)=>{
        conn.query(sql,uid,function(err,positions){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                res.status(200); 
                res.json({positions}); //결과 보냄  
            }
        });
        conn.release();
    });
}

//기술 넣기
exports.putTech = function(req,res){

    var uid = req.body.uid;
    var tech_name = req.body.tech_name; 

    var sql = 'insert STACK (uid,tech_name) values (?,?)'

    var params = [uid,tech_name];
    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) 
        {
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                res.status(201);
                res.json({'message':'success'});
            }
        });
        conn.release();
    });
}

//기술 빼기
exports.deleteTech = function(req,res){

    var uid = req.body.uid;
    var tech_name = req.body.tech_name;

    var sql = 'delete from STACK where uid=? and tech_name=?';
    var params = [uid,tech_name];
    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) 
        {
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                res.status(201);
                res.json({'message':'success'});
            }
        });
        conn.release();
    });
}