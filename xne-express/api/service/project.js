const db = require('xne-db/mysql');

exports.getProjects = async (id) => {
  return await db.ProjectModel.findAll({
    attributes: ['project_name','ins_id'],
    where: {id: id},
    raw: true,
  });
};

