// Validations
import Branch from "../models/branch";
import SubBranch from "../models/sub-branch";
import Group from "../models/group";
import SubGroup from "../models/sub-group";
import ProgrammingError from "../api/validations/programmer-error";
import OperationalError, {ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR,} from "../api/validations/operational-error";

// Models

const debug = require('debug')('app:dev');

const categoryController = {
    createBranch: async function (req, res, next) {
        try {
            const {
                title
            } = req.body;
            let branch = await Branch.findOne({
                title: title,
                isDeleted: false
            });
            if (branch) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "branch"));
            }
            const newBranch = new Branch({
                title: title,
            });
            await newBranch.save();
            return res.status(200).json(newBranch);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    branchesList: async function (req, res, next) {
        try {
            let branches = await Branch.find({
                isDeleted: false
            });
            return res.status(200).json(branches);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    createSubBranch: async function (req, res, next) {
        try {
            const {
                title,
                branch
            } = req.body;


            let subBranch = await SubBranch.findOne({
                title: title,
                isDeleted: false,
            });
            if (subBranch) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "subBranch"));
            }
            const newSubBranch = new SubBranch({
                title: title,
                branch: branch,
            });
            await newSubBranch.save();
            return res.status(200).json(newSubBranch);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    subBranchesList: async function (req, res, next) {
        try {
            let subBranches = await SubBranch.find({
                isDeleted: false
            }).populate(
                "branch"
            );
            if (subBranches) {
                return res.status(200).json(subBranches);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "subBranch"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    createGroup: async function (req, res, next) {
        try {
            const {
                title,
                subBranch
            } = req.body;
            let group = await Group.findOne({
                title: title,
                subBranch: subBranch
            });
            if (group) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "group"));
            }
            const newGroup = new Group({
                title: title,
                subBranch: subBranch,
            });
            await newGroup.save();
            return res.status(200).json(newGroup);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    groupsList: async function (req, res, next) {
        try {
            let groups = await Group.find({
                isDeleted: false
            }).populate("subBranch");
            return res.status(200).json(groups);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    createSubGroup: async function (req, res, next) {
        try {
            const {
                title,
                group
            } = req.body;
            let subgroup = await SubGroup.findOne({
                title: title,
                group: group,
                isDeleted: false,
            });
            if (subgroup) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "subGroup"));
            }
            const newSubGroup = new SubGroup({
                title: title,
                group: group,
            });
            await newSubGroup.save();
            return res.status(200).json(newSubGroup);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    subgroupsList: async function (req, res, next) {
        try {
            let subGroups = await SubGroup.find({
                isDeleted: false
            }).populate(
                "group"
            );
            return res.status(200).json(subGroups);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    categoryList: async function (req, res, next) {
        try {
            let branches = await Branch.find({
                isDeleted: false
            });
            let resultArr = [];
            for (const branch of branches) {
                let subBranchArr = [];
                let subBranches = await SubBranch.find({
                    isDeleted: false,
                    branch: branch._id
                });
                for (const subBranch of subBranches) {
                    let groupArr = [];
                    let groups = await Group.find({
                        isDeleted: false,
                        subBranch: subBranch._id
                    });
                    for (const group of groups) {
                        let subGroups = await SubGroup.find({
                            isDeleted: false,
                            group: group._id
                        })
                        groupArr.push({
                            group,
                            subGroups
                        });
                    }
                    subBranchArr.push({
                        subBranch,
                        groupArr
                    })
                }
                resultArr.push({
                    branch,
                    subBranchArr
                });
            }
            debug("resultArr", resultArr);
            return res.status(200).json(resultArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editBranch: async function (req, res, next) {
        try {
            const { title } = req.body;
            let branch = await Branch.findOne({ _id: req.params.id, isDeleted: false });
            if (!branch)
                return next(new OperationalError(NOT_FOUND_ERROR, "branch"));
            let updatedBranch = await Branch.updateOne({ _id: req.params.id, isDeleted: false }, {
                title: title,
                 updatedAt: Date.now()
            })
            return res.status(200).json(updatedBranch);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteBranch: async function (req, res, next) {
        try {
            //
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
            
        }
    },
    editSubBranch: async function (req, res, next) {
        try {
            const { title } = req.body;
            let subBranch = await SubBranch.findOne({
                _id:req.params.id,
                isDeleted:false
            });
            if (!subBranch)
                return next(new OperationalError(NOT_FOUND_ERROR, "subBranch"));
                
            let updatedSubBranch = await SubBranch.updateOne({
                 _id:req.params.id,
                isDeleted:false
            }, {
                title: title,
                 updatedAt: Date.now()
            });
            return res.status(200).json(updatedSubBranch);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
            
        }
    },
    deleteSubBranch: async function (req, res, next) {
        try {
            //
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
            
        }
    },
    editGroup: async function (req, res, next) {
        try {
            const { title } = req.body;
            let group = await Group.findOne({
                _id:req.params.id,
                isDeleted:false
            })
            if (!group)
                return next(new OperationalError(NOT_FOUND_ERROR, "group"));
            let updatedGroup = await Group.updateOne({
                _id:req.params.id,
                isDeleted:false
            }, {
                title: title,
                 updatedAt: Date.now()
            });
            return res.status(200).json(updatedGroup);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteGroup: async function (req, res, next) {
        try {
            //
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editSubGroup: async function (req, res, next) {
        try {
            const { title } = req.body;
            let subGroup = await SubGroup.findOne({ isDeleted: false, _id: req.params.id });
            if (!subGroup)
                return next(new OperationalError(NOT_FOUND_ERROR, "subGroup"));
            let updatedSubGroup = await SubGroup.updateOne({
                isDeleted: false,
                _id:req.params.id
            }, {
                title: title,
                 updatedAt: Date.now()
            });
            return res.status(200).json(updatedSubGroup);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteSubGroup: async function (req, res, next) {
      try {
          //
      } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
      }  
    },
};

export default categoryController;