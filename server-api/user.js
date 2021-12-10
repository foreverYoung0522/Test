
var db = require('./db');
reqBodySchema = db.reqBodySchema;

//로그인
exports.getUser = function(req,res)
{
    var uid = req.params.id;
    var sql = 'select uid,name,image from PROFILE where uid = ?'

    db.getConnection((conn)=>{
        conn.query(sql,uid,function(err,user){
            if(err){
                console.log(err);
                res.status(401);
            }
            else{ //uid 저장된게 없는 경우 (처음 로그인)
                if(user.length===0){
                    var message = 'new'; //첫 로그인임을 알림
    
                    res.json({ //보내기 
                        'message':message
                    });  
                }
                else {
                    res.status(200); 
                    res.json({user}); //결과 보냄
                }
            }
        })  
        conn.release();
    });
};

//회원가입 api. 로그인하고 uid가 없을 때(프로필 정보 입력)
exports.postUser = function (req,res){

    //console.log(req.body);
    var uid = req.body.uid;
    var name = req.body.name;
    var image = req.file.location;
    //var birth = req.body.birth;
    //var blog = req.body.blog;
    //var gender = req.body.gender;
    
    var email = req.body.email;
    var school = req.body.school;
    var major = req.body.major;
    var resume = req.body.resume;
    var position = req.body.position;

    
    var params = [uid,name,image,email,school,major,resume];
    

    var position_list = position.split(',');
    //params = params.concat(cate_list);

    var sql3= '("'+uid+'",?)'

    for (var i =1 ; i<position_list.length; i++){
        sql3 = sql3 + ',("'+uid+'",?)'
    }

    const validError = reqBodySchema.validate(name);
    if(validError.length > 0){
        return res.status(400).json({'error': 1, 'message' :validError[0].message});
    };

    var sql = 'insert into PROFILE (uid,name,image,emaile,school,major,resume) values(?,?,?,?,?,?,?)';
    var sql2 = 'insert into STACK (uid,tech_name) values ' + sql3;


   
    db.getConnection((conn)=>{
        conn.query(sql, params, function (err, result) 
        {
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                //res.status(201);
                //res.json("success");
            }
        });
       
        conn.query(sql2, position_list, function (err, result) 
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
    
}; //첫 회원가입. 기본 정보들 입력해야 함.

//전체 회원 조회
exports.getAllUser = function (req, res) 
{
    var uid = req.params.id;
    var sql = 'SELECT a.uid,a.name,a.image,c.tech_name,a.school,a.major, b.is_like from PROFILE as a LEFT JOIN INTEREST as b ON a.uid = (select b.inter_uid  where b.uid = ?) LEFT JOIN STACK as c ON a.uid = c.uid group by a.uid order by a.uid*1 desc'
    
    db.getConnection((conn)=>{
        conn.query(sql,uid,function(err,profiles){
            if(err){
                console.log(err);
                res.status(500);
            }
            else {
                res.status(200); 
                res.json({profiles}); //결과 보냄  
            }
        });
        conn.release();
    });
};

//프로필 조회
exports.getProfile = function(req,res){

    var uid = req.params.id;
    var params = [uid];
    var sql = 'SELECT * FROM PROFILE where uid = ?';
    var sql2 = 'SELECT tech_name FROM STACK where uid =?';
    
    var profile;

    console.log(uid);
    db.getConnection((conn)=>{
        conn.query(sql,params,function(err,result){
            console.log(result);
            if(err){
                console.log(err);
                res.status(401).json;
            }
            else {
                profile = result;
                //res.header("Content-Type: profile")
                //res.status(200).json(result); //결과 보냄  
                
            }
        });
        conn.query(sql2,params,function(err,positions){
            console.log(positions);
            if(err){
                console.log(err);
                res.status(401).json;
            }
            else {

                //res.header("Content-Type: profile")
                res.status(200).json({profile,positions}); //결과 보냄  
                
            }
        });
        conn.release();
    });
};

//회원정보 수정 //포지션 업데이트 어케할지?
exports.updateUser =function (req, res) 
{

    const validError = reqBodySchema.validate(req.body.name)
    if(validError.length > 0){
        return res.status(400).json({'error': 1, 'message' :validError[0].message})
    }


    var uid = req.params.id;
    var name = req.body.name;
    var image = req.file.location;
    var experience = req.body.experience;
    var email = req.body.email;
    var school = req.body.school;
    var major = req.body.major;
    var resume = req.body.resume;
    var position = req.body.position;
    
    var position_list = position.split(',');
    //params = params.concat(cate_list);

    var sql4= '('+uid+',?)'

    for (var i =1 ; i<position_list.length; i++){
        sql4 = sql4 + ',('+uid+',?)'
    }



    var params = [name,image,experience,email,school,major,resume,uid];
    var sql = 'update PROFILE set name = ?, image = ?,experience=?, emaile = ? ,school=?, major =?,resume=? where uid = ?'
    var sql2 = 'delete * from STACK where uid = ?'
    var sql3 = 'insert into STACK (uid,tech_name) values ' + sql4;
    
    db.getConnection((conn)=>{  
        conn.query(sql, params, function (err, result) {
        
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                //res.status(200); 
                //res.json("success");
            }
           
        });
        conn.query(sql, params, function (err, result) {
        
            if (err) {
                console.log(err);
                res.status(401);
            } else {
                //res.status(200); 
                //res.json("success");
            }
           
        });
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




