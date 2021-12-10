var db = require('./db');
reqBodySchema = db.reqBodySchema;


//검색된 팀 정보 가져오기
exports.getSearchTeam = function(req,res){

    var uid = req.params.id;
    var search_word = req.body.search_word;
    var params = [uid,search_word,search_word,search_word,search_word];

    var sql = 'SELECT a.T_num,DATEDIFF(a.limit_date, now()) as d_day,a.title, a.limit_member,a.num_member ,a.recruit, b.C_num,b.C_name,b.cate_name,b.d_day, c.is_book FROM TEAM as a LEFT JOIN COMPET_INFO as b ON a.C_num = b.C_num LEFT JOIN BOOKMARK as c ON a.T_num =(select c.T_num where c.uid = ?) where a.title like "%"?"%" or a.search_tag like "%"?"%" or b.C_name like "%"?"%" or b.cate_name like "%"?"%"'

    console.log(search_word);

    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,teams){
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

//팀 정보 필터링하기
exports.getFilterTeam = function(req,res){

    var uid = req.params.id;
    var category = req.body.category;

    var cate_list = category.split(',');

    var params = [uid];
    params = params.concat(cate_list);

    var sql2= 'b.cate_name like "%"?"%"'

    for (var i =1 ; i<cate_list.length; i++){
        sql2 = sql2 + ' or b.cate_name like "%"?"%"'
    }
    
    var sql = 'SELECT a.T_num,DATEDIFF(a.limit_date, now()) as d_day,a.title, a.limit_member,a.num_member ,a.recruit, b.C_num,b.C_name,b.cate_name,b.d_day, c.is_book FROM TEAM as a LEFT JOIN COMPET_INFO as b ON a.C_num = b.C_num LEFT JOIN BOOKMARK as c ON a.T_num =(select c.T_num where c.uid = ?) where ' + sql2;

    

    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,teams){
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

//검색된 프로필 정보 가져오기
exports.getSearchProfile = function(req,res){

    var uid = req.params.id;
    var search_word = req.body.search_word;
    var params = [uid,search_word,search_word,search_word,search_word];

    var sql = 'SELECT a.uid,a.name,a.image,c.tech_name,a.school,a.major, b.is_like from PROFILE as a LEFT JOIN INTEREST as b ON a.uid = (select b.inter_uid  where b.uid = ?) LEFT JOIN STACK as c ON a.uid = c.uid where a.name like "%"?"%" or c.tech_name like "%"?"%" or a.school like "%"?"%" or a.major like "%"?"%" group by a.uid order by a.uid*1 desc'

    console.log(search_word);

    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,profiles){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                res.status(200); 
                res.json({profiles}); //결과 보냄  
            }
        });
        conn.release();
    });
};

//프로필 보기 필터링하기
exports.getFilterProfile = function(req,res){

    var uid = req.params.id;
    var category = req.body.category;

    var cate_list = category.split(',');

    var params = [uid];
    params = params.concat(cate_list);

    var sql2= 'c.tech_name like "%"?"%"'

    for (var i =1 ; i<cate_list.length; i++){
        sql2 = sql2 + ' or c.tech_name like "%"?"%"'
    }
    
    var sql = 'SELECT a.uid,a.name,a.image,c.tech_name,a.school,a.major, b.is_like from PROFILE as a LEFT JOIN INTEREST as b ON a.uid = (select b.inter_uid  where b.uid = ?) LEFT JOIN STACK as c ON a.uid = c.uid where '+sql2+' group by a.uid order by a.uid*1 desc';

    

    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,profiles){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                
                res.status(200); 
                res.json({profiles}); //결과 보냄  
            }
        });
        conn.release();
    });
};


//검색된 공모전 정보 가져오기
exports.getSearchCompet = function(req,res){

    var uid = req.params.id;
    var search_word = req.body.search_word;
    var params = [uid,search_word,search_word];

    var sql = 'select a.C_num, a.C_name, a.image, a.d_day, substring_index(a.cate_name,",",1) as cate_name,b.is_book from COMPET_INFO as a LEFT JOIN COMPET_BOOKMARK as b ON a.C_num =(select b.C_num where b.uid = ?) where a.C_name like "%"?"%" or a.cate_name like "%"?"%" order by a.C_num*1 desc';

    console.log(search_word);

    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,compets){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
                res.status(200); 
                res.json({compets}); //결과 보냄  
            }
        });
        conn.release();
    });
};

//공모전 보기 필터링하기
exports.getFilterCompet = function(req,res){

    var uid = req.params.id;
    var category = req.body.category;

    var cate_list = category.split(',');

    var params = [uid];
    params = params.concat(cate_list);

    var sql2= 'a.cate_name like "%"?"%"'

    for (var i =1 ; i<cate_list.length; i++){
        sql2 = sql2 + ' or a.cate_name like "%"?"%"'
    }
    
    var sql = 'select a.C_num, a.C_name, a.image, a.d_day, substring_index(a.cate_name,",",1) as cate_name,b.is_book from COMPET_INFO as a LEFT JOIN COMPET_BOOKMARK as b ON a.C_num =(select b.C_num where b.uid = ?) where '+sql2+' order by a.C_num*1 desc';

    

    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,profiles){
            if(err){
                console.log(err);
                res.status(401);
            }
            else {
               
                res.status(200); 
                res.json({profiles}); //결과 보냄  
            }
        });
        conn.release();
    });
};