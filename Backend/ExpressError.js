class ExpressError extends Error{
    constructor(status,message)
    {
        super();
        this.status=status;
        this.messsage=message;
    }
}

export default ExpressError;