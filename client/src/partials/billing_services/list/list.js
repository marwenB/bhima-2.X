angular.module('bhima.controllers')
.controller('BillingServicesListController', BillingServicesListController);

BillingServicesListController.$inject = [
  '$translate', 'BillingServicesService', 'AccountService'
];

/**
 * The Billing Services Controller
 *
 * This is the default controller for the billing services URL endpoint.  It
 * downloads and displays all billing services in the application via a ui-grid.
 */
function BillingServicesListController($translate, BillingServices, Accounts) {
  var vm = this;

  var editTemplate =
    '<div style="margin: 0px 5px 5px 5px;"><a class="btn btn-sm btn-default btn-block" ng-href="#/admin/billing_services/{{ row.entity.id}}" data-method="update"><span class="glyphicon glyphicon-pencil"></a></div>';

  var deleteTemplate =
    '<div style="margin: 0px 5px 5px 5px;"><button class="btn btn-sm btn-default btn-block" ng-click="grid.appScope.delete(row.entity)" data-method="delete"><span class="glyphicon glyphicon-trash"></span></button></div>';

  // these options are for the ui-grid
  vm.options = {
    appScopeProvider: vm,
    enableSorting : true,
    enableColumnMenus: false,
    columnDefs : [
      { field : 'id', displayName : $translate.instant('COLUMNS.ID'), width: 45 },
      { field : 'account', displayName : $translate.instant('COLUMNS.ACCOUNT'), width: '*' },
      { field : 'label', displayName : $translate.instant('COLUMNS.LABEL') },
      { field : 'description', displayName: $translate.instant('COLUMNS.DESCRIPTION') },
      { field : 'value', displayName : $translate.instant('COLUMNS.VALUE'), cellFilter:'percentage', cellClass: 'text-right' },
      { field : 'created_at', displayName : $translate.instant('COLUMNS.DATE'), cellFilter:'date', cellClass: 'text-center' },
      { field : 'edit', displayName: '', cellTemplate : editTemplate, width: 45 },
      { field : 'delete', displayName : '', cellTemplate: deleteTemplate, width: 45 }
    ]
  };

  // default loading state - false;
  vm.loading = false;

  // fired on state init
  function startup() {

    // turn the loading indicator on
    toggleLoadingIndicator();

    // retrieve a detailed list of the billing services in the application
    BillingServices.read(null, { detailed : 1 })
    .then(function (billingServices) {

      // make a pretty human readable account label
      billingServices.forEach(function (service) {
        service.account = Accounts.label(service);
      });

      // populate the grid
      vm.options.data = billingServices;
    })
    .catch(function (error) {
      vm.error = error;
    })
    .finally(function () {
      toggleLoadingIndicator();
    });
  }

  function toggleLoadingIndicator() {
    vm.loading = !vm.loading;
  }

  function edit(row) {
    console.log('Clicked edit with:', row);
  }

  function del(row) {
    console.log('Clicked delete with:', row);
  }

  vm.edit = edit;
  vm.delete = del;


  startup();
}
