
var db = require('./db');
var secretkey = require('../config/secretkey').secretkey;
var options = require('../config/secretkey').options;


reqBodySchema = db.reqBodySchema;

//지원하기 누르면 공모전 이름, 학교,학과 띄우기
exports.applyTeam = function(req,res){
    var uid = req.body.uid;
    var T_num = req.body.T_num;
    var params = [uid,T_num];

    var sql = 'select a.T_num, b.C_name,c.school,c.major from TEAM as a left join COMPET_INFO as b on a.C_num = b.C_num left join PROFILE as c on c.uid = ? where T_num = ?'
    db.getConnection((conn)=>{

        conn.query(sql,params,function(err,app_info){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                res.status(200); 
                //res.json(result); //결과 보냄  
                res.json({app_info});
            }
        });
    });
}

//메시지 전송 눌러 지원 목록에 넣기
exports.postApplyTeam = function(req,res){
    var uid = req.body.uid;
    var T_num = req.body.T_num;

    var title = req.body.title ;
    var resume = req.body.resume;
    var message = req.body.message;

    var params = [uid,T_num,title,message,resume];
    var sql = 'insert into APPLICANT (uid,T_num,title,message,resume) values(?,?,?,?,?)'

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

//지원 목록 가져오기
exports.getApplyList = function(req,res){
    
    var T_num = req.body.T_num;

    var sql = 'select a.uid,a.resume,b.name,b.school,b.major from APPLICANT as a left join PROFILE as b on a.uid = b.uid where T_num = ?'

    db.getConnection((conn)=>{

        conn.query(sql,T_num,function(err,app_list){
            console.log(app_list);
            if(err){
                console.log(err);
                res.status(401).json;
            }
            else {
                res.status(200); 
                //res.json(result); //결과 보냄  
                res.json({app_list});
                
            }
        });
        conn.release();
    });

}

//지원자 자세히보기
exports.getApplyDetail = function(req,res){

    var uid = req.params.id;

    var sql = 'select a.*,b.name,b.school,b.major from APPLICANT as a left join PROFILE as b on a.uid = b.uid where a.uid = ?'
    db.getConnection((conn)=>{
        conn.query(sql,uid,function(err,app_list){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                res.status(200); 
                //res.json(result); //결과 보냄  
                res.json({app_list});
            }
        });
    });

}