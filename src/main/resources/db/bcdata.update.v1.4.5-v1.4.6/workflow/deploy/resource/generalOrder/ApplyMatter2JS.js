bc.namespace("bswf.generalOrder");
bswf.generalOrder.ApplyMatterForm = {
	init : function(option,readonly){
		var $form = $(this);
		
		// 选择申请部门
		$form.find("#selectUnitOrDepartment").click(function(){
			bc.identity.selectUnitOrDepartment({
				data:{status:0},
				onOk : function(u) {
					$form.find(":input[name='verifyUnitOrDepartmentId']").val(u.id);
					$form.find(":input[name='verifyUnitOrDepartmentName']").val(u.name);
				}
			});
		});
		
		//绑定下一步的处理方式事件
		$form.find(":input[name='rhanding']").change(function(){
			switch($(this).val()){
				case "送相关部门协办":
					handing_show($form.find("#co4department"));
					handing_hide($form.find("#OperationDirectorCheck"));
					handing_hide($form.find("#GeneralManagerGroupCheck"));
					handing_hide($form.find("#chairmanCheck"));
					 break;
				case "送营运总监审批":
					handing_hide($form.find("#co4department"));
					handing_show($form.find("#OperationDirectorCheck"));
					handing_hide($form.find("#GeneralManagerGroupCheck"));
					handing_hide($form.find("#chairmanCheck"));
					 break;
				case "送总经理组审批":
					handing_hide($form.find("#co4department"));
					handing_hide($form.find("#OperationDirectorCheck"));
					handing_show($form.find("#GeneralManagerGroupCheck"));
					handing_hide($form.find("#chairmanCheck"));
					 break;
				case "送董事长审批":
					handing_hide($form.find("#co4department"));
					handing_hide($form.find("#OperationDirectorCheck"));
					handing_hide($form.find("#GeneralManagerGroupCheck"));
					handing_show($form.find("#chairmanCheck"));
					 break;
				default: alert("other");
			}
		});
		
		//下一步处理方式自定义显示函数
		function handing_show($div){
			$div.show();
			//css:bswf-generalOrder-ignore
			$ignore=$div.find(".bswf-generalOrder-ignore");
			$ignore.each(function(){
				if($(this).hasClass("ignore")){
					$(this).removeClass("ignore");
				}
			});

			//css:bswf-generalOrder-flow
			$flow=$div.find(".bswf-generalOrder-flow");
			$flow.each(function(){
					$(this).val(true);
			});
			
		}
		//下一步处理方式自定义隐藏函数
		function handing_hide($div){
			$div.hide();
			
			//css:bswf-generalOrder-ignore
			$ignore=$div.find(".bswf-generalOrder-ignore");
			$ignore.each(function(){
				if(!$(this).hasClass("ignore")){
					$(this).addClass("ignore");
				}
			});
			
			//css:bswf-generalOrder-flow
			$flow=$div.find(".bswf-generalOrder-flow");
			$flow.each(function(){
					$(this).val(false);
			});
			
			var $departmentsTRs = $div.find("#co4departmentTable tr:gt(0)");
			$departmentsTRs.remove();
			
			$lis=$div.find("li:not(.inputIcon)");
			$lis.remove();
		}
		
		
		//------------添加行-------------------
		var tableEl=$form.find("#co4departmentTable")[0];
		$form.find("#addLine").click(function() {
			var $departmentsTRs = $form.find("#co4departmentTable tr:gt(0)");
			var ids='';
			$departmentsTRs.each(function(){
				$tr = $(this);
				var $inputs = $tr.find(":input");
				if(ids==''){
					ids=$inputs[0].value;
				}else{
					ids+=','+$inputs[0].value;
				}
			});
			bc.identity.selectUnitOrDepartment({
				data:{status:0,multiple:true},
				onOk : function(uArr) {
					//检测添加相同部门
					var addflag=true;
					var departStr='';
					if(ids.length>0){
						for(var i=0;i<uArr.length;i++){
							u=uArr[i];
							var idsArr=ids.split(",");
							for(var i=0;i<idsArr.length;i++){
								if(idsArr[i]==u.id){
									addflag=false;
									if(departStr == ''){
										departStr=u.cname;
									}else{
										departStr+='、'+u.cname;
									}
								}
							}
						}
					}
					
					if(!addflag){
						bc.msg.alert(departStr+"已添加！");
						return;
					}
				
					for(var i=0;i<uArr.length;i++){
						u=uArr[i];
						//插入行
						var newRow=tableEl.insertRow(tableEl.rows.length);
						newRow.setAttribute("class","ui-widget-content row");

						//插入列
						var cell=newRow.insertCell(0);
						cell.style.padding="0";
						cell.style.textAlign="left";
						cell.setAttribute("class","id first");
						cell.innerHTML='<span class="ui-icon"></span>'
							+'<input type="hidden" class="ignore"	value="'+u.id+'"/><input type="hidden" class="ignore"	value="'+u.code+'"/>';
						
						cell=newRow.insertCell(1);
						cell.style.padding="0";
						cell.style.textAlign="left";
						cell.setAttribute("class","middle");
						cell.innerHTML='<input type="text" class="ignore" style="width:100%;height:100%;background:none;border:none;padding:0 0 0 2px;"  value="'
							+u.cname+'" readonly="readonly">';
						
						cell=newRow.insertCell(2);
						cell.style.padding="0";
						cell.style.textAlign="left";
						cell.setAttribute("class","middle");
						cell.innerHTML='<div style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;font-weight: normal;width: 98%;" >'
							+'<span class="selectTransactor selectButton verticalMiddle ui-icon ui-icon-circle-plus"  title="点击添加协办人"></span>'
							+'<ul class="horizontal" style="padding: 0;overflow:hidden;"></ul>'
							+'</div>';
						
						cell=newRow.insertCell(3);
						cell.style.padding="0";
						cell.style.borderWidth="1px 1px 0 1px";
						cell.setAttribute("class","last");
					}
				}
			});
		});
		//点击选中行
		$form.find("#co4departmentTable").delegate("tr.ui-widget-content.row>td.id","click",function(){
			$(this).parent().toggleClass("ui-state-highlight").find("td:eq(0)>span.ui-icon").toggleClass("ui-icon-check");
		});
		$form.find("#co4departmentTable").delegate("tr.ui-widget-content.row input","focus",function(){
			$(this).closest("tr.row").removeClass("ui-state-highlight").find("td:eq(0)>span.ui-icon").removeClass("ui-icon-check");
		});
		//删除表中选中的
		$form.find("#deleteLine").click(function() {
			var $trs = $form.find("#co4departmentTable tr.ui-state-highlight");
			if($trs.length == 0){
				bc.msg.slide("请先选择要删除的信息！");
				return;
			}
			bc.msg.confirm("确定要删除选定的 <b>"+$trs.length+"</b>条信息吗？",function(){
				for(var i=0;i<$trs.length;i++){
					$($trs[i]).remove();
				}
			});
			
		});
		
		//上移表中选中的
		$form.find("#upLine").click(function() {
			var $trs = $form.find("#co4departmentTable tr.ui-state-highlight");
			if($trs.length == 0){
				bc.msg.slide("请先选择要上移的！");
				return;
			}else{
				$trs.each(function(){
					var $tr = $(this);
					if($tr[0].rowIndex < 2){
						bc.msg.slide("不能再上移！");					
					}else{
						var $beroreTr=$tr.prev();
						$beroreTr.insertAfter($tr);
					}
				});
			}

		});
		//下移表中选中的
		$form.find("#downLine").click(function() {
			var $trs = $form.find("#co4departmentTable tr.ui-state-highlight");
			if($trs.length == 0){
				bc.msg.slide("请先选择要下移的！");
				return;
			}else{
				
				for(var i=$trs.length;i>0;i--){
					var $tr=$($trs[i-1]);
					var $beroreTr=$tr.next();
					if($beroreTr.length==0){
						bc.msg.slide("不能再下移！");					
					}else{
						$beroreTr.insertBefore($tr);
					}
				}
			}
		});
		
		//声明li
		var liTpl = '<li class="horizontal  ui-widget-content ui-corner-all ui-state-highlight" data-id="{0}"'+
		" data-hidden='{1}'"+
		' style="position: relative;margin:0 2px;float: left;padding: 0;border-width: 0;">'+
		'<span class="text">{2}</span>'+
		'<span class="click2remove verticalMiddle ui-icon ui-icon-close" style="margin: -8px -2px;" title={3}></span></li>';
		
		//绑定添加办理人事件
		$form.delegate(".selectTransactor","click",function(){
				$row = $(this).closest(".row");
				$inputs = $row.find(":input");
				$ul = $row.find("ul");
				$lis = $ul.find("li");
				var selecteds="";
				$lis.each(function(i){
					selecteds+=(i > 0 ? "," : "") + ($(this).attr("data-id"));//
				});
				bc.identity.selectUser({
					multiple: true,//可多选
					status:'0',
					selecteds: selecteds,
					group:$inputs[1].value,
					onOk: function(users){
						$.each(users,function(i,user){
							if($lis.filter("[data-id='" + user.id + "']").size() > 0){//已存在
								logger.info("duplicate select: id=" + user.id + ",name=" + user.name);
							}else{//新添加的
								var data={
									id:user.id,
									code:user.account,
									name:user.name
								}
								$(liTpl.format(user.id,$.toJSON(data),user.name,'点击移除'))
								.appendTo($ul).find("span.click2remove")
								.click(function(){
									$(this).parent().remove();
								});
							}
						});
					}
				});
		});

	},
	buildFormData : function(){
		$form = $(this);
		if($form.find(":input[name='isManager']").val()=='true'){
			var rhanding=$form.find(":input[name='rhanding']:checked").val();
			$form.find(":input[name='handing']").val(rhanding);
			
			if(rhanding=="送相关部门协办"){
				var $departmentsTRs = $form.find("#co4departmentTable tr:gt(0)");
				//用户显示的部门信息
				var co4departments = [];
				
				//多实例集合变量
				var list_departmentAndAssignee=[];
				
				$departmentsTRs.each(function(){
						$inputs=$(this).find(":input");
						$lis=$(this).find("ul>li");
						var transactorNames='';
						var transactorIds='';
						$lis.each(function(){
							var temp=$(this).attr("data-hidden");
							obj_transactor=eval("("+temp+")");
							if(transactorNames==''){
								transactorNames=obj_transactor.name;
								transactorIds=obj_transactor.id;
							}else{
								transactorNames+= ","+obj_transactor.name;
								transactorIds+= ","+obj_transactor.id;
							}
							
							//实例变量
							var instance={
								mcode:$inputs[1].value,
								mname:$inputs[2].value,
								assignee:obj_transactor.code,
								assigneeId:obj_transactor.id,
								subject:'相关部门协办（'+$inputs[2].value+'）'
							}
							
							list_departmentAndAssignee.push(instance);
						});
						
						var co4department={
							co4departmentId:$inputs[0].value,
							co4departmentCode:$inputs[1].value,
							co4departmentName:$inputs[2].value,
							transactorNames:transactorNames,
							transactorIds:transactorIds
						}
						co4departments.push(co4department);
				});
				
				$form.find(":input[name='list_am_co4department']").val($.toJSON(co4departments));
				$form.find(":input[name='list_co4departmentAndAssignee']").val($.toJSON(list_departmentAndAssignee));
			}else if(rhanding=="送营运总监审批"){
				$div=$form.find("#OperationDirectorCheck");	
				$lis=$div.find("ul>li");
				$inputs=$div.find(":input");
				//多实例集合变量
				var list_departmentAndAssignee = [];
				$lis.each(function(){
					var temp=$(this).attr("data-hidden");
					obj_transactor=eval("("+temp+")");
					//实例变量
					var instance={
						assignee:obj_transactor.code,
						assigneeName:obj_transactor.name,
						assigneeId:obj_transactor.id
					}
					
					list_departmentAndAssignee.push(instance);
				});
				$form.find(":input[name='list_odc4assignee']").val($.toJSON(list_departmentAndAssignee));
				
			}else if(rhanding=="送总经理组审批"){
				$div=$form.find("#GeneralManagerGroupCheck");	
				$lis=$div.find("ul>li");
				$inputs=$div.find(":input");
				//多实例集合变量
				var list_departmentAndAssignee = [];
				$lis.each(function(){
					var temp=$(this).attr("data-hidden");
					obj_transactor=eval("("+temp+")");
					//实例变量
					var instance={
						assignee:obj_transactor.code,
						assigneeName:obj_transactor.name,
						assigneeId:obj_transactor.id
					}
					
					list_departmentAndAssignee.push(instance);
				});
				$form.find(":input[name='list_gmgc4assignee']").val($.toJSON(list_departmentAndAssignee));
			}
		}
	},
	
	/** 表单验证方法 */
	validateForm: function(){
		$form = $(this);
	
		if(!bc.validator.validate(this))
			return false;
			
		if($form.find(":input[name='isManager']").val()=='true'){
			$rhandings=$form.find(":input[name='rhanding']");
			var checked=false;
			$rhandings.each(function(){
				if($(this)[0].checked){
					checked=true;
				}
			});

			if(!checked){
				bc.msg.alert("请选择下一步处理方式！");
				return false;
			}
		
			if($form.find(":input[name='rhanding']:checked").val()=="送相关部门协办"){
				//先检测部门
				var $departmentsTRs = $form.find("#co4departmentTable tr");
				if($departmentsTRs.size()<2){
					bc.msg.alert("请添加协办部门！");
					return false;
				}
				
				//检测部门中的协办人
				var check=false;
				var deprt='';
				$departmentsTRs.each(function(index){
					if(index>0){
						$inputs=$(this).find(":input");
						$lis=$(this).find("ul>li");
						if($lis.size()<1){
							check=true;
							deprt=$inputs[2].value;
							return;
						}
					}
				});
				if(check){
					bc.msg.alert("请为协办部门"+deprt+"添加协办人！");
					return false;
				}
			}else if($form.find(":input[name='rhanding']:checked").val()=="送营运总监审批"){
				$div=$form.find("#OperationDirectorCheck");	
				$lis=$div.find("ul>li");
				if($lis.size()<1){
					bc.msg.alert("请添加营运总监！");
					return false;
				}

			}else if($form.find(":input[name='rhanding']:checked").val()=="送总经理组审批"){
				$div=$form.find("#GeneralManagerGroupCheck");	
				$lis=$div.find("ul>li");
				if($lis.size()<1){
					bc.msg.alert("请添加总经理！");
					return false;
				}
			}
		}
			
		bswf.generalOrder.ApplyMatterForm.buildFormData.call(this);

		return true;
	}
};