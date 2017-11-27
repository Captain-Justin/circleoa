var weight=valObj("weight");
var  rtn="";
var ccDoc =getCurrentDocument();
var wrok_id=ccDoc.getId();
var plan_id=valObj("plan_id");
var sql="select * from tlk_xm_warehouse_plan where id='"+plan_id+"'";
var datas=findBySQL(sql);
var rate_id=datas.getItemValueAsString("rate_id");
var sql_t="select * FROM tlk_xm_cost_detail d where d.parent='"+wrok_id+"' and d.item_rate_id='" + rate_id+"'";
var count =countBySQL(sql_t);
if(!count&&rate_id) {
  var sql2 = "select * from tlk_xm_basic_cost_rate where id='" + rate_id + "'";
  var rateDoc = findBySQL(sql2);
  var price = rateDoc.getItemValue("rate");
  var joint_rate=rateDoc.getItemValue("fengbaogong");//价格
  var driver_rate=rateDoc.getItemValue("chachesiji");
  if (weight>0) {//生成应付数据
    //插入数据到应付中
    var rate_unit = rateDoc.getItemValue("rate_unit");//计费单位（元/吨、元/柜、元/月）
    var newNumber = 1;//数量默认为1
    if ("元/吨".equals(rate_unit)) {
      newNumber = weight / 1000;//公斤改为吨
    } else if ("元/柜".equals(rate_unit)) {
      newNumber = 1;
    }
    var form = getFormProcess().doViewByFormName("xm_cost_detail", getApplication());
    var paramsTable = createParamsTable();
    var newdocs = form.createDocument(paramsTable, getWebUser());
    var newSum = rate * newNumber;//金额=单价*数量
    newdocs.findItem("cost_name").setValue(rateDoc.getItemValue("cost_name"));//计费名称
    newdocs.findItem("price").setValue(rate);//单价
    newdocs.findItem("joint_rate").setValue(joint_rate);//单价
    newdocs.findItem("driver_rate").setValue(driver_rate);//单价
    newdocs.setParent(wrok_id);//单价
    newdocs.findItem("rate_unit").setValue(rate_unit);//单位
    newdocs.findItem("rate_id").setValue(rate_id);//单位
    newdocs.findItem("number").setValue(newNumber);//数量
    newdocs.findItem("joint_total").setValue(joint_rate*newNumber);//单价
    newdocs.findItem("driver_total").setValue(driver_rate*newNumber);//单价
    newdocs.findItem("sum").setValue(newSum);//金额
    newdocs.findItem("xm_work_id").setValue(wrok_id);//作业单ID（对应作业单数据ID）
    getDocumentProcess().doCreateOrUpdate(newdocs, getWebUser());

  }
}

rtn;
