class User_DTO{
    constructor(user){
        this._id = user._id;
        this.email = user.email;
        this.role = user.role;
        user.store_id ? this.store_id = user.store_id:this.store_id=null ;
        this.approved_status= user.approved_status;
    }
}

module.exports = User_DTO;