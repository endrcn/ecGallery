var app = angular.module("app",[]);
app.controller("ecGalleryController",function($scope,ecGalleryFactory){
	
	
	$scope.getGalleryMaterials = function(){
		console.log("getGalleryMaterials");
		ecGalleryFactory.getGalleryMaterials()
		.success(function(response){
			$scope.galleryMaterials = response;
			console.log($scope.galleryMaterials);
		});
	}
	
	$scope.addMaterial = function(){
		$scope.yukleniyor = true;
		var frmData = new FormData();
		if($scope.files!=undefined){
			angular.forEach($scope.files,function(file){
				frmData.append('file',file);
			});
		}
		ecGalleryFactory.addMaterial(frmData)
		.success(function(response){
			angular.forEach(response,function(item){
				$scope.galleryMaterials.push(item);
			});
			
			$scope.yukleniyor = false;
		});
	}
	
	$scope.selectMaterial = function(material,index){
		console.log("İlk Hal: "+selectedMaterials.length);
		var i=0;
		while(i < selectedMaterials.length && 
				selectedMaterials[i].id!=material.id){
			i++;
		}
		
		if(i<selectedMaterials.length){
			console.log(selectedMaterials[i]);
			selectedMaterials.splice(i,1);
			console.log("Silindi: "+i+" - "+selectedMaterials.length);
			jQuery("#material_"+index).css("border","1px solid #ddd");
		}else{
			selectedMaterials.push(material);
			console.log("Eklendi: "+selectedMaterials.length);
			jQuery("#material_"+index).css("border","1px solid green");
		}
		
		console.log(selectedMaterials);
	}
	
}).factory("ecGalleryFactory",function($http){
	return {
		getGalleryMaterials : function(){
			return $http.get(HostURL+"/editor/getUserGallery");
		},
		addMaterial : function(material){
			return $http.post(HostURL+"/editor/addImageList",material,{
				transformRequest : angular.identity,
				headers : {'Content-Type' : undefined}
			});
		}
	}
}).directive('fileInput',['$parse',function($parse){
	return {
		restrict:'A',
		link: function(scope,elm,attrs){
			
			elm.bind('change',function(){
				//console.log(attrs.fileInput);
				$parse(attrs.fileInput)
				.assign(scope,elm[0].files);
				
				scope.files = elm[0].files;
				
				scope.$apply();
			});
		}
	}
}]);