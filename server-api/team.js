
var db = require('./db');
reqBodySchema = db.reqBodySchema;

//팀 생성 API
exports.postTeam= function(req,res){

    var C_num = req.body.C_num;
    var uid = req.body.uid;
    var limit_member = req.body.limit_member;
    var limit_date = req.body.limit_date;
    var num_member = req.body.num_member;
    var title = req.body.title;
    var app_condition = req.body.app_condition;
    var prefer = req.body.prefer;
    var detail = req.body.detail;
    var recruit = req.body.recruit;
    var search_tag = req.body.search_tag;
    

    var params = [C_num,uid,limit_member,num_member,limit_date,title,app_condition,prefer,detail,recruit,search_tag];
    var params2 = [uid,uid,C_num];

    var sql = 'insert into TEAM(C_num,uid,limit_member,num_member,limit_date,d_day,title,app_condition,prefer,detail,recruit,search_tag) values(?,?,?,?,?,DATEDIFF(limit_date, now()),?,?,?,?,?,?)';
    var sql2 = 'insert into TEAM_MEMBERS(uid,T_num,is_leader) values (?,(select T_num from TEAM where uid = ? and C_num = ?),true)';

    //팀 생성 시 팀장은 자동으로 팀원 추가
    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,result){
            if (err) {
                console.log(err);
            } else {
                //팀 만들기 성공했을 경우에만 팀장 추가
                conn.query(sql2,params2,function(err,result){
                    if (err) {
                        console.log(err);
                        res.status(401);
                    } else {
                        res.status(201);
                        res.json({'message':'success'});
                    };
                
                });
            };
            
        });
        conn.release();
    });
   
};

//팀 삭제
exports.deleteTeam = function(req,res){

    var uid = req.body.uid;
    var T_num = req.body.T_num;

    var params = [uid,T_num];
    var sql = 'delete from TEAM where uid=? and T_num=?'

    
    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) {
        
            console.log(uid,T_num);
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

//모든 팀 정보 가져오기(공모전 정보와 함께) -> 팀 검색 화면에 띄울 api(첫 화면)
exports.getAllTeam = function(req,res){

    var uid = req.params.id;
    var sql = 'SELECT a.T_num,DATEDIFF(a.limit_date, now()) as d_day,a.title, a.limit_member,a.num_member ,a.recruit, b.C_num,b.C_name,b.cate_name,b.d_day, c.is_book FROM TEAM as a LEFT JOIN COMPET_INFO as b ON a.C_num = b.C_num LEFT JOIN BOOKMARK as c ON a.T_num =(select c.T_num where c.uid = ?)'

    db.getConnection((conn)=>{
        conn.query(sql,uid,function(err,teams){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                res.status(200); 
                res.json({teams}); //결과 보냄  
            }
        });
        conn.release();
    });
};

//선택한 팀 정보 가져오기
exports.getSelectTeam = function(req,res){

    var uid = req.params.id;
    var T_num = req.body.T_num;
    var params = [uid,T_num];
    
    var sql = 'SELECT a.T_num,DATEDIFF(a.limit_date, now()) as d_day,a.title, a.limit_member,a.num_member,a.app_condition,a.prefer,a.detail,a.recruit,a.search_tag, b.C_num,b.C_name,b.image,b.cate_name,b.d_day,c.is_book FROM TEAM as a LEFT JOIN COMPET_INFO as b ON a.C_num = b.C_num LEFT JOIN BOOKMARK as c ON a.T_num =(select c.T_num where c.uid = ?) where a.T_num = ?'
    var sql2 = 'SELECT b.uid,a.is_leader,b.name,b.image,c.tech_name,b.school,b.major from TEAM_MEMBERS as a LEFT JOIN PROFILE as b on a.uid = b.uid LEFT JOIN STACK as c on a.uid = c.uid where a.T_num = ? group by a.uid '
    db.getConnection((conn)=>{
        var team_info
        conn.query(sql,params,function(err,result){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                team_info = result
                //res.status(200); 
            }
        });
        conn.query(sql2,T_num,function(err,team_members){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                res.status(200); 
                //res.json(result); //결과 보냄  
                res.json({team_info,team_members});
            }
        });
        conn.release();
    });

    

};

//연락하기 누르고 초대할 공모전 선택 보여주기
exports.getMyTeam = function(req,res){


    var uid = req.params.id;

    var sql = 'select a.T_num,a.title,b.C_name from TEAM as a left join COMPET_INFO as b on a.C_num = b.C_num where a.uid = ?'

    db.getConnection((conn)=>{
        conn.query(sql,uid,function(err,team_info){
            if(err){
                console.log(err);
                res.status(401);
            }
            if(team_info.length===0){
                var message = 'my team is empty';  //내 팀 정보 없음
                res.status(204).json(message);  
            }
            else {
                //res.status(200); 
                //res.json(result); //결과 보냄  
                res.json({team_info});
            }
        });
        
        conn.release();
    });

}

//나의 팀 정보 가져오기(공모전 정보와 함께) : 자세한 정보
exports.getTeam = function(req,res){

    var uid = req.params.id;
    var T_num = req.body.T_num;
    var params = [uid,T_num];
    var sql = 'SELECT a.T_num,DATEDIFF(a.limit_date, now()) as d_day,a.title, a.limit_member,a.num_member,a.app_condition,a.prefer,a.detail,a.recruit,a.search_tag, b.C_num,b.C_name,b.image,b.cate_name,b.d_day,c.is_book FROM TEAM as a LEFT JOIN COMPET_INFO as b ON a.C_num = b.C_num LEFT JOIN BOOKMARK as c ON a.T_num =(select c.T_num where c.uid = ?) where a.T_num = ?'
    var sql2 = 'SELECT b.uid,a.is_leader,b.name,b.image,c.tech_name,b.school,b.major from TEAM_MEMBERS as a LEFT JOIN PROFILE as b on a.uid = b.uid LEFT JOIN STACK as c on a.uid = c.uid where a.T_num = ? group by a.uid'
   
    db.getConnection((conn)=>{
        var team_info
        conn.query(sql,params,function(err,result){
            if(err){
                console.log(err);
                res.status(401);
                
            }
            else{ 
                if(result.length===0){
                    var message = 'my tema is empty';  //내 팀 정보 없음
                    res.status(204).json(message);  
                }
                else {
                    team_info = result
                    //res.status(200); 
                }
            }
        });
        conn.query(sql2,T_num,function(err,team_members){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                //res.status(200); 
                //res.json(result); //결과 보냄  
                res.json({team_info,team_members});
            }
        });
        
        conn.release();
    });
};





