
var db = require('./db');
reqBodySchema = db.reqBodySchema;

//공모전 정보 다 가져오기
exports.getAllCompet=function(req,res){

    var uid = req.params.id;

    var sql = 'select a.C_num, a.C_name, a.image, a.d_day, substring_index(a.cate_name,",",1) as cate_name,b.is_book from COMPET_INFO as a LEFT JOIN COMPET_BOOKMARK as b ON a.C_num =(select b.C_num where b.uid = ?) order by a.C_num*1 desc'
    var sql2 = 'update COMPET_INFO set nowdate = now(), d_day = (DATEDIFF(C_endDate, now()))'

    db.getConnection((conn)=>{

        conn.query(sql2,function(err,result){
            if(err){
                console.log(err);
                res.status(500);
            }
        });

        conn.query(sql,uid,function(err,compets){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                res.status(200); 
                res.json({compets}); //결과 보냄  
            }
        });
        conn.release();
    });
};

//선택된 공모전 정보 가져오기
exports.getSelectCompet = function(req,res){

    
    var uid = req.params.id;
    var C_num = req.body.C_num;

    var params = [C_num,uid,C_num];
    var params2 = [uid,C_num];
    var sql = 'select a.* ,b.is_book from COMPET_INFO as a LEFT JOIN COMPET_BOOKMARK as b ON a.C_num =(select b.C_num where b.uid = ?) where a.C_num = ? order by a.C_num*1 desc'
    var sql2 = 'update COMPET_INFO set nowdate = now(), d_day = (DATEDIFF(C_endDate, now()))'
    var sql3 = 'SELECT a.T_num,DATEDIFF(a.limit_date, now()) as team_d_day,a.title, a.limit_member,a.num_member ,a.recruit,b.C_name,b.cate_name,b.d_day as compet_d_day, c.is_book FROM TEAM as a LEFT JOIN COMPET_INFO as b ON b.C_num = ? LEFT JOIN BOOKMARK as c ON a.T_num =(select c.T_num where c.uid = ?) where a.C_num = ?'


    db.getConnection((conn)=>{

        var compet
        conn.query(sql2,function(err,result){
            if(err){
                console.log(err);
                res.status(500);
            }
        });

        conn.query(sql,params2,function(err,result){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                //res.status(200); 
                //res.json({compets}); //결과 보냄  
                compet = result;
            }
        });
        conn.query(sql3,params,function(err,teams){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                
                res.status(200).json({compet,teams}); //결과 보냄  
            }
        });
        conn.release();
    });

}
