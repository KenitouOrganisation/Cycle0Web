// class from Cycle0 App project
Engine.DebounceCall = class
{

    constructor(invokeTime=500){
        this.timeout = null;
        this.invokeTime = invokeTime;
        this.lastTimeClicked = 0;
    }

    Invoke(callback){
        if(Date.now() - this.lastTimeClicked > this.invokeTime){
            console.log('------> Invoke accepted')
            callback();
        }else{
            console.log('------> Invoke rejected')
        }

        this.lastTimeClicked = Date.now();

        /*
        if(this.timeout)
            clearTimeout(this.timeout);

        this.timeout = setTimeout(()=>{
            callback ? callback() : null;
        }, time);
        */
    }

    InvokeAsync(callback){
        return new Promise((req, rej)=>{
            this.Invoke(async ()=>{

                req(callback ? await callback() : null);

            });
        });
    }

}