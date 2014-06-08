/**
 * GET /compare
 * Visualizations page.
 */

exports.compare = function(req, res) {
  res.render('compare', {
    title: 'Mass Edu info portal: School Comparison'
  });
};
