var db = require('./db');
reqBodySchema = db.reqBodySchema;

//팀 북마크 처리
exports.putBookmark = function(req,res){
    var uid = req.body.uid;
    var T_num = req.body.T_num;

    var params = [uid,T_num];
    var sql = 'insert into BOOKMARK set uid = ?, T_num = ?'

    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) {
        
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                res.status(200); 
                res.json({'message':'success'});
            }
        });
        conn.release();
    });
};

//팀 북마크 취소
exports.deleteBookmark = function(req,res){

    var uid = req.body.uid;
    var T_num = req.body.T_num;

    var params = [uid,T_num];
    var sql = 'delete from BOOKMARK where uid=? and T_num=?'

    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) {
        
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                res.status(200); 
                res.json({'message':'success'});
            }
        });
        conn.release();
    });
}



//공모전 북마크 처리
exports.putCompetBookmark = function(req,res){
    var uid = req.body.uid;
    var C_num = req.body.C_num;

    var params = [uid,C_num];
    var sql = 'insert into COMPET_BOOKMARK set uid = ?, C_num = ?'

    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) {
        
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                res.status(200); 
                res.json({'message':'success'});
            }
        });
        conn.release();
    });
};

//공모전 북마크 취소
exports.deleteCompetBookmark = function(req,res){

    var uid = req.body.uid;
    var C_num = req.body.C_num;

    var params = [uid,C_num];
    var sql = 'delete from COMPET_BOOKMARK where uid=? and C_num=?'

    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) {
        
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                res.status(200); 
                res.json({'message':'success'});
            }
        });
        conn.release();
    });
}