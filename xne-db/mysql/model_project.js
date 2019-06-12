const { Sequelize, pool } = require('./mysql');

const ProjectModel = pool.define(`project`, {
  // 机构id
  ins_id: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  // 项目名称
  project_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
    // 启用时间
    timestamps: true,
    // 创建时间
    createdAt: 'ctime',
    // 修改时间
    updatedAt: 'mtime',
    // 表注释
    comment: '项目表',
  });

ProjectModel.sync();
ProjectModel.upsert({
  ins_id: '100001',
  project_name: '能耗项目'
})

module.exports = ProjectModel;
