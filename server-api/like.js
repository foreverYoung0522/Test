var db = require('./db');
reqBodySchema = db.reqBodySchema;

//좋아요 처리
exports.putLike = function(req,res){
    var uid = req.body.uid;
    var inter_uid = req.body.inter_uid;

    var params = [uid,inter_uid];
    var sql = 'insert into INTEREST set uid = ?, inter_uid = ?'

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

//좋아요 취소
exports.deleteLike = function(req,res){

    var uid = req.body.uid;
    var inter_uid = req.body.inter_uid;

    var params = [uid,inter_uid];
    var sql = 'delete from INTEREST where uid=? and inter_uid=?'

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