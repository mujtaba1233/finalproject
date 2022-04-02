var Mysql = require('../helpers/database-manager');
const orderJson = require('../helpers/order-json.json')
var moment = require('moment');

const quoteJson = require('../helpers/quote-json.json')
exports.GetOrderColumns = async function () {
    try {
        var result = await Mysql.query("show columns from orders")
        var result2 = result.map((elem) => {
            if (orderJson[elem.Field])
                return elem
            else {
                delete elem
                return
            }
        })
        var result2 = result2.filter(function (el) {
            return el != null;
        });
        return result2
    } catch (e) {
        console.log(e)
        return {
            error: e.message,
            status: 0
        }
    }
}

exports.GetQuoteColumns = async function () {
    try {
        var result = await Mysql.query("show columns from quotes")
        var result2 = result.map((elem) => {
            if (quoteJson[elem.Field])
                return elem
            else {
                delete elem
                return
            }
        })
        var result2 = result2.filter(function (el) {
            return el != null;
        });

        return result2
    } catch (e) {
        console.log(e)
        return {
            error: e.message,
            status: 0
        }
    }
}

exports.GetReports = async function (user) {
    try {
        let reportUser = user
        var result = await Mysql.query("select id,tableName,reportName,columns,createdOn from reporting where createdBy = " + reportUser + " ORDER BY id DESC;")
        return result
    } catch (e) {
        console.log(e)
        return {
            error: e.message,
            status: 0
        }
    }
}

exports.GetReport = async function (id) {
    try {
        let data = []
        var result = await Mysql.query("select tableName, reportName, columns from reporting  where id = " + id + "" )
        data = {
            tableName: result[0].tableName,
            reportName: result[0].reportName,
            columns: result[0].columns.split(","),
            where:[]
        };
        var result2 = await Mysql.query("select feild,reportCondition,value,reportId from where_reporting  where reportId = " + id + " " )
        result2.map(report=>{
            data.where.push({
                feild:report.feild,
                condition: report.reportCondition,
				value: report.value,
            })
        })
        return data
    } catch (e) {
        console.log(e)
        return {
            error: e.message,
            status: 0
        }
    }
}

exports.PostQuery = async function (queries) {
        let result = Execute(queries)
        let reportId = ""
        if(queries.reportName !== "undefined" && queries.reportName !== null && queries.reportName)
        {   
            try{
                let where = queries.where
                let result2 = {}
                delete queries.where
                if(queries.reportId){
                 result2 = await Mysql.query("UPDATE reporting set tableName = '"+ queries.tableName +"',reportName = '"+ queries.reportName +"',columns = '"+ queries.columns.toString() +"',createdBy = '"+ queries.createdBy +"',createdOn = '"+ moment(queries.createdOn).format('YYYY-MM-DD:h:mm:ss') +"',isActive = '"+ queries.isActive +"' where id = "+  queries.reportId)

                }
                else{
                    result2 = await Mysql.query("insert into reporting (tableName,reportName,columns,createdBy,createdOn,isActive) values('"+ queries.tableName+"', '"+ queries.reportName +"' , '" +queries.columns.toString() + "', " + queries.createdBy+", '"+ moment(queries.createdOn).format('YYYY-MM-DD:h:mm:ss')+ "', "+ queries.isActive +")" )
                }
                try{
                    let id = 0
                    
                    if(queries.reportId){
                        id = queries.reportId
                        const deleteResult = await Mysql.query("delete from where_reporting where reportId = " + id)
                    }
                    else{
                        id = result2.insertId
                    }

                    let whereReportingQuery = "INSERT into where_reporting (feild, reportCondition, value, reportId) VALUES "; 
                    for (var i = 0; i < where.length; i++) {
                        whereReportingQuery += "(\'" + where[i].feild + "\',\'" + where[i].condition + "\',\'" + where[i].value + "\' , " + id +" )";
                        if (i != where.length - 1) {
                            whereReportingQuery += ",";
                        }
                    }
                    let result3 = await Mysql.query(whereReportingQuery, {})
                    reportId = id
                }catch(e){
                    console.log(e)
                    return {
                        error: e.message,
                        status: 0
                    }
                }
            }catch(e){
                console.log(e)
                return {
                    error: e.message,
                    status: 0
                }
            }
        }
        return {result,reportId}
}

exports.ExecuteQuery = async function(queries) {
        return Execute(queries)

}
const Execute =async function(queries){
    try{
        let query = "Select "

        if(queries.columns){
            if (queries.columns.length > 1) {
                queries.columns.forEach(column => {
                    if(column !== "SelectAll")
                    query += " " + column + ", "
                    
                });
                queries.columns.forEach(column => {
                    if(column === "SelectAll")
                    query = "Select * "
                });
                queries.columns.forEach(column => {
                    if(column === "SelectAll")
                    query = "Select * "
                });
                query = query.replace(/,\s*$/, "");
            } else {
                if(queries.columns[0] !== "SelectAll")
                query += " " + queries.columns[0] + " "
                else{
                    query = "Select * "
                }
            }
        }
        let reportId = ''
        query += " from " + queries.tableName
        let invertedComma = "'"
        if (queries.where.length > 1) {
            if(queries.where[0].feild !== null && queries.where[0].feild !== "undefined" && queries.where[0].feild)
            {
            query += " where "
            queries.where.forEach(cond => {
                if(cond.feild !== null && cond.feild !== "undefined" && cond.feild){
                let percentage =""
                if(cond.feild !== "OrderID" && cond.feild!=="Affiliate_Commissionable_Value" && cond.feild!=="OrderTaxExempt" && cond.feild!=="BatchNumber" && cond.feild!=="CashTender" && cond.field!=="CustomerID" && cond.field!=="LastModBy" && cond.field!=="PaymentAmount" && cond.field!=="PaymentMethodID" && cond.field!=="SalesRep_CustomerID" && cond.field!=="SalesTax1" && cond.field!=="SalesTax2" && cond.field!=="SalesTax3" && cond.field!=="SalesTaxRate" && cond.field!=="SalesTaxRate1" && cond.field!=="SalesTaxRate2" && cond.field!=="SalesTaxRate3" && cond.field!=="ShippingMethodID" && cond.field!=="Stock_Priority" && cond.field!=="Tax2_IncludePrevious" && cond.field!=="Tax3_IncludePrevious" && cond.field!=="Total_Payment_Authorized" && cond.field!=="Total_Payment_Received" && cond.field!=="TotalShippingCost" && cond.field!=="VendorID" && cond.field!=="IsCustomerNameShow" && cond.field!=="IsCustomerEmailShow" && cond.field!=="QuoteNo" && cond.field!=="UserId" && cond.field!=="OldOrder" && cond.field!=="IsTaxExempt" && cond.field!=="TaxExemptionId" && cond.field!=="IsPayed" && cond.field!=="CurrentCustomerDiscount" && cond.field!=="InsuranceValue" && cond.field!=="displayOrder" && cond.field!=="IsFreeOrder" ) 
                percentage = "%"
                if(cond.condition === "=" && cond.feild !== "OrderID" && cond.feild!=="Affiliate_Commissionable_Value" && cond.feild!=="OrderTaxExempt" && cond.feild!=="BatchNumber" && cond.feild!=="CashTender" && cond.field!=="CustomerID" && cond.field!=="LastModBy" && cond.field!=="PaymentAmount" && cond.field!=="PaymentMethodID" && cond.field!=="SalesRep_CustomerID" && cond.field!=="SalesTax1" && cond.field!=="SalesTax2" && cond.field!=="SalesTax3" && cond.field!=="SalesTaxRate" && cond.field!=="SalesTaxRate1" && cond.field!=="SalesTaxRate2" && cond.field!=="SalesTaxRate3" && cond.field!=="ShippingMethodID" && cond.field!=="Stock_Priority" && cond.field!=="Tax2_IncludePrevious" && cond.field!=="Tax3_IncludePrevious" && cond.field!=="Total_Payment_Authorized" && cond.field!=="Total_Payment_Received" && cond.field!=="TotalShippingCost" && cond.field!=="VendorID" && cond.field!=="IsCustomerNameShow" && cond.field!=="IsCustomerEmailShow" && cond.field!=="QuoteNo" && cond.field!=="UserId" && cond.field!=="OldOrder" && cond.field!=="IsTaxExempt" && cond.field!=="TaxExemptionId" && cond.field!=="IsPayed" && cond.field!=="CurrentCustomerDiscount" && cond.field!=="InsuranceValue" && cond.field!=="displayOrder" && cond.field!=="IsFreeOrder" )
                cond.condition ="Like"
                let invertedComma = "'"
                query += " " + cond.feild + " " + cond.condition + " " + invertedComma  + percentage + cond.value + percentage + invertedComma + " && "
            }});
            query = query.replace(/&&\s*$/, " ");}
        } else {
            if(queries.where[0].feild !== null && queries.where[0].feild !== "undefined" && queries.where[0].feild)
            {
            query += " where "
            let percentage =""
            if(queries.where[0].feild !== "OrderID" && queries.where[0].feild!=="Affiliate_Commissionable_Value" && queries.where[0].feild!=="OrderTaxExempt" && queries.where[0].feild!=="BatchNumber" && queries.where[0].feild!=="CashTender" && queries.where[0].field!=="CustomerID" && queries.where[0].field!=="LastModBy" && queries.where[0].field!=="PaymentAmount" && queries.where[0].field!=="PaymentMethodID" && queries.where[0].field!=="SalesRep_CustomerID" && queries.where[0].field!=="SalesTax1" && queries.where[0].field!=="SalesTax2" && queries.where[0].field!=="SalesTax3" && queries.where[0].field!=="SalesTaxRate" && queries.where[0].field!=="SalesTaxRate1" && queries.where[0].field!=="SalesTaxRate2" && queries.where[0].field!=="SalesTaxRate3" && queries.where[0].field!=="ShippingMethodID" && queries.where[0].field!=="Stock_Priority" && queries.where[0].field!=="Tax2_IncludePrevious" && queries.where[0].field!=="Tax3_IncludePrevious" && queries.where[0].field!=="Total_Payment_Authorized" && queries.where[0].field!=="Total_Payment_Received" && queries.where[0].field!=="TotalShippingCost" && queries.where[0].field!=="VendorID" && queries.where[0].field!=="IsCustomerNameShow" && queries.where[0].field!=="IsCustomerEmailShow" && queries.where[0].field!=="QuoteNo" && queries.where[0].field!=="UserId" && queries.where[0].field!=="OldOrder" && queries.where[0].field!=="IsTaxExempt" && queries.where[0].field!=="TaxExemptionId" && queries.where[0].field!=="IsPayed" && queries.where[0].field!=="CurrentCustomerDiscount" && queries.where[0].field!=="InsuranceValue" && queries.where[0].field!=="displayOrder" && queries.where[0].field!=="IsFreeOrder" )
            percentage = "%"
            if(queries.where[0].condition === "=" && queries.where[0].feild !== "OrderID"  && queries.where[0].feild!=="Affiliate_Commissionable_Value" && queries.where[0].feild!=="OrderTaxExempt" && queries.where[0].feild!=="BatchNumber" && queries.where[0].feild!=="CashTender" && queries.where[0].field!=="CustomerID" && queries.where[0].field!=="LastModBy" && queries.where[0].field!=="PaymentAmount" && queries.where[0].field!=="PaymentMethodID" && queries.where[0].field!=="SalesRep_CustomerID" && queries.where[0].field!=="SalesTax1" && queries.where[0].field!=="SalesTax2" && queries.where[0].field!=="SalesTax3" && queries.where[0].field!=="SalesTaxRate" && queries.where[0].field!=="SalesTaxRate1" && queries.where[0].field!=="SalesTaxRate2" && queries.where[0].field!=="SalesTaxRate3" && queries.where[0].field!=="ShippingMethodID" && queries.where[0].field!=="Stock_Priority" && queries.where[0].field!=="Tax2_IncludePrevious" && queries.where[0].field!=="Tax3_IncludePrevious" && queries.where[0].field!=="Total_Payment_Authorized" && queries.where[0].field!=="Total_Payment_Received" && queries.where[0].field!=="TotalShippingCost" && queries.where[0].field!=="VendorID" && queries.where[0].field!=="IsCustomerNameShow" && queries.where[0].field!=="IsCustomerEmailShow" && queries.where[0].field!=="QuoteNo" && queries.where[0].field!=="UserId" && queries.where[0].field!=="OldOrder" && queries.where[0].field!=="IsTaxExempt" && queries.where[0].field!=="TaxExemptionId" && queries.where[0].field!=="IsPayed" && queries.where[0].field!=="CurrentCustomerDiscount" && queries.where[0].field!=="InsuranceValue" && queries.where[0].field!=="displayOrder" && queries.where[0].field!=="IsFreeOrder" )
            queries.where[0].condition ="Like"
            query += " " + queries.where[0].feild  + " " + queries.where[0].condition + " '"+percentage + queries.where[0].value + percentage+"' "
        }}
        console.log(query)
        let result = await Mysql.query(query)
        return result
    }catch(e){
        console.log(e)
        return {
            error: e.message,
            status: 0
        }
    }
    
}