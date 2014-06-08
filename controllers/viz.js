/**
 * GET /visualizations
 * Visualizations page.
 */

exports.viz = function(req, res) {
  res.render('viz', {
    title: 'Mass Edu info portal: Visualizations'
  });
};
