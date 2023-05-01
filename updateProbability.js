(function() {
  'use strict';
  let handler = function(event){
      let record = event.record;
      let orderStage = record.order_stage.value;
      let probabilityStage = Number(record.probability.value);
      let newProbability = null;
      if (orderStage === 'Rejected') {
        newProbability = 0;
      } else if (orderStage === 'Not Started' || orderStage === 'In Queue' || orderStage === 'On Hold') {
        newProbability = 50;
      } else if (orderStage === 'In Progress') {
        newProbability = 75;
      } else if (orderStage === 'Processed') {
        newProbability = 100;
      }
      if (
        newProbability !== null &&
        newProbability !== probabilityStage &&
        confirm('Update Probability: ' + newProbability + '% since Order Stage is "' + orderStage + '"?')
      ) {
        record.probability.value = newProbability;
      }
      console.log(event);
      return event;
    };
  
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit',
    'app.record.index.edit.submit'
  ], handler);
})();
