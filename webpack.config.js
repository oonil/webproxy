const path=require('path');


module.exports=env=>({
    
    mode:"none",
    entry:env.entry,
    output:{
        path:path.resolve(__dirname,"public"),
        filename:env.output
    },
    target:'web',
    watch:true,
    optimization:{
      minimize:false
    },
});