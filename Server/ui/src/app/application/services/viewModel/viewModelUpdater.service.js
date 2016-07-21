'use strict';

angular
    .module('hawk')
    .factory('viewModelUpdater', ['viewModel', 'toaster', 'adminGroupService', '$rootScope', function (viewModel, toaster, adminGroupService, $rootScope) {
        var viewModelUpdater = this;

        viewModelUpdater.updateAgents = function (agents) {
            viewModel.allAgents = agents;
            //toaster.pop('success', "Notification", "Agents updated!");
        };

        viewModelUpdater.addAgent = function (agent) {
            viewModel.allAgents.push(agent);
            toaster.pop('success', "Notification", "Agent " + agent.id + " added!")
        };

        viewModelUpdater.updateAgent = function (agent) {
            viewModel.allAgents.forEach(function (currentAgent, index, array) {
                if (currentAgent.id == agent.id) {
                    viewModel.allAgents[index] = agent;
                    //toaster.pop('success', "Notification", "Agent " + agent.hostName + "-" + agent.id.substr(0, 8) + " updated!");
                }
            })
        };

        viewModelUpdater.getPipelineGroupById = function (pipelineGroup) {
            return pipelineGroup;
        };

        viewModelUpdater.addPipelineGroup = function (pipelineGroup) {
            viewModel.allPipelineGroups.push(pipelineGroup);
            toaster.pop('success', "Notification", "Pipeline Group " + pipelineGroup.name + " added!")
        };

        viewModelUpdater.updatePipelineGroup = function (pipelineGroup) {
            viewModel.allPipelineGroups.forEach(function (currentPipelineGroup, index, array) {
                if (currentPipelineGroup.id == pipelineGroup.id) {
                    array[index] = pipelineGroup;
                    toaster.pop('success', "Notification", "Pipeline Group " + pipelineGroup.name + " updated!");
                }
            })
        };

        viewModelUpdater.deletePipelineGroup = function () {
            adminGroupService.getAllPipelineGroups();
            toaster.pop('success', "Notification", "Pipeline Groups updated!")
        };

        viewModelUpdater.getAllPipelineGroups = function (pipelineGroups) {
            viewModel.allPipelineGroups = pipelineGroups;
            toaster.pop('success', "Notification", "Pipeline Groups updated!");
        };

        viewModelUpdater.getAllPipelineDefinitions = function (pipelineDefinitions){
            viewModel.allPipelines = pipelineDefinitions;
            toaster.pop('success', "Notification", "Pipelines updated!");
        };

        viewModelUpdater.updatePipelineGroupDTOs = function (pipelineGroupDTOs) {
            //viewModel.allPipelineDefinitions = pipelineGroupDTOs;
            viewModel.allPipelineGroups = pipelineGroupDTOs;
            toaster.pop('success', "Notification", "Pipelines updated!");
        };

        viewModelUpdater.addPipelineDefinition = function (pipelineDefinition) {
            viewModel.allPipelineGroups.forEach(function (currentPipelineGroupDTO, index, array) {
                if(currentPipelineGroupDTO.id == pipelineDefinition.pipelineGroupId){
                    array[index].pipelines.push(pipelineDefinition);
                    viewModel.allPipelines.push(pipelineDefinition);
                    toaster.pop('success', "Notification", "Pipeline Definition " + pipelineDefinition.name + " added!")
                }
            });
        };

        viewModelUpdater.updatePipelineDefinition = function (pipelineDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if(currentPipeline.id == pipelineDefinition.id){
                    viewModel.allPipelines[index] = pipelineDefinition;
                    toaster.pop('success', "Notification", "Pipeline Definition " + pipelineDefinition.name + " updated!")
                }
            });

            viewModel.allPipelineGroups.forEach(function (currentPipelineGroupDTO, index, array) {
                if(currentPipelineGroupDTO.id == pipelineDefinition.pipelineGroupId) {
                    viewModel.allPipelineGroups[index].pipelines.forEach(function (currentPipeline, pipelineIndex, array) {
                        if(currentPipeline.id == pipelineDefinition.id) {
                            viewModel.allPipelineGroups[index].pipelines[pipelineIndex] = pipelineDefinition;
                        }
                    });
                }
            });
        };

        viewModelUpdater.getAllMaterialDefinitions = function (materialDefinitions) {
            //viewModel.allMaterials = materialDefinitions;
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                materialDefinitions.forEach(function (currentMaterial, materialIndex, materialArray) {
                    if(currentPipeline.id == currentMaterial.pipelineDefinitionId){
                        viewModel.allPipelines[index].materialDefinitions = materialDefinitions;
                    }
                });
            });
            viewModel.allMaterialDefinitions = materialDefinitions;
            toaster.pop('success', "Notification", "Materials updated!");
        };

        viewModelUpdater.getMaterialDefinitionById = function (materialDefinition) {
            return materialDefinition;
        };

        viewModelUpdater.addMaterialDefinition = function (materialDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if(currentPipeline.id == materialDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].materialDefinitions.push(materialDefinition);
                }
            });
        };

        viewModelUpdater.updateMaterialDefinition = function (materialDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if(currentPipeline.id == materialDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].materials.forEach(function (currentMaterial, materialIndex, array) {
                        if(currentMaterial.id == materialDefinition.id){
                            viewModel.allPipelines[index].materialDefinitions[materialIndex] = materialDefinition;
                            toaster.pop('success', "Notification", "Material " + materialDefinition.name + " updated!");
                        }
                    });
                }
            });
        };

        viewModelUpdater.deleteMaterialDefinition = function (materialDefinition) {

        };

        viewModelUpdater.getAllStageDefinitions = function (stageDefinitions) {
            viewModel.allStages = stageDefinitions;
            toaster.pop('success', "Notification", "Stages updated!");
        };

        viewModelUpdater.getStageDefinitionById = function (stageDefinition) {
            return stageDefinition;
        };

        viewModelUpdater.addStageDefinition = function (stageDefinition) {
            //viewModel.allStages.push(stageDefinition);
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if (currentPipeline.id == stageDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].stageDefinitions.push(stageDefinition);
                }
            });
            toaster.pop('success', "Notification", "Stage " + stageDefinition.name + " added!");
        };

        viewModelUpdater.updateStageDefinition = function (stageDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if(currentPipeline.id == stageDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].stageDefinitions.forEach(function (currentStage, stageIndex, array) {
                        if(currentStage.id == stageDefinition.id) {
                            viewModel.allPipelines[index].stageDefinitions[stageIndex] = stageDefinition;
                            toaster.pop('success', "Notification", "Stage " + stageDefinition.name + " updated!");
                        }
                    });
                }
            });
        };

        viewModelUpdater.deleteStageDefinition = function (stageDefinition) {

        };

        viewModelUpdater.getAllJobDefinitions = function (jobDefinitions) {
            viewModel.allJobs = jobDefinitions;
            toaster.pop('success', "Notification", "Jobs updated!")
        };

        viewModelUpdater.getJobDefinitionById = function (jobDefinition) {

        };

        viewModelUpdater.addJobDefinition = function (jobDefinition) {
            //viewModel.allJobs.push(jobDefinition);
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if (currentPipeline.id == jobDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].stageDefinitions.forEach(function (currentStage, stageIndex, stageArray) {
                        if(currentStage.id == jobDefinition.stageDefinitionId){
                            viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions.push(jobDefinition);
                            toaster.pop('success', "Notification", "Job " + jobDefinition.name + " added!")
                        }
                    });
                }
            });

        };

        viewModelUpdater.updateJobDefinition = function (jobDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if(currentPipeline.id == jobDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].stageDefinitions.forEach(function (currentStage, stageIndex, stageArray) {
                        if(currentStage.id == jobDefinition.stageDefinitionId) {
                            viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions.forEach(function (currentJob, jobIndex, jobArray) {
                                if(currentJob.id == jobDefinition.id) {
                                    viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions[jobIndex] = jobDefinition;
                                    toaster.pop('success', "Notification", "Job " + jobDefinition.name + " updated!");
                                }
                            });
                        }
                    });
                }
            });
        };

        viewModelUpdater.deleteJobDefinition = function (jobDefinition) {

        };

        viewModelUpdater.getAllPipelines = function (pipelines) {
            viewModel.allPipelineRuns = pipelines;
            toaster.pop('success', "Notification", "Pipeline Runs updated!");
        };

        viewModelUpdater.addPipeline = function (pipeline) {
            viewModel.allPipelineRuns.push(pipeline);
            toaster.pop('success', "Notification", "Pipeline run started successfully!")
        };

        viewModelUpdater.updatePipeline = function (pipeline) {
            viewModel.allPipelineRuns.forEach(function (currentPipeline, index, array) {
                if(currentPipeline.id == pipeline.id) {
                    viewModel.allPipelineRuns[index] = pipeline;
                }
            });
        };

        viewModelUpdater.addTaskDefinition = function (taskDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if (currentPipeline.id == taskDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].stageDefinitions.forEach(function (currentStage, stageIndex, stageArray) {
                        if(currentStage.id == taskDefinition.stageDefinitionId){
                            viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions.forEach(function (currentJob, jobIndex, array) {
                                if(currentJob.id == taskDefinition.jobDefinitionId){
                                    viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions[jobIndex].taskDefinitions.push(taskDefinition);
                                    toaster.pop('success', "Notification", "Task " + taskDefinition.name + " added!");
                                }
                            });
                        }
                    });
                }
            });
        };

        viewModelUpdater.updateTaskDefinition = function (taskDefinition) {
            viewModel.allPipelines.forEach(function (currentPipeline, index, array) {
                if (currentPipeline.id == taskDefinition.pipelineDefinitionId) {
                    viewModel.allPipelines[index].stageDefinitions.forEach(function (currentStage, stageIndex, stageArray) {
                        if(currentStage.id == taskDefinition.stageDefinitionId){
                            viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions.forEach(function (currentJob, jobIndex, array) {
                                if(currentJob.id == taskDefinition.jobDefinitionId){
                                    viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions[jobIndex].taskDefinitions.forEach(function (currentTask, taskIndex, array) {
                                        if(currentTask.id == taskDefinition.id){
                                            viewModel.allPipelines[index].stageDefinitions[stageIndex].jobDefinitions[jobIndex].taskDefinitions[taskIndex] = taskDefinition;
                                            toaster.pop('success', "Notification", "Task " + taskDefinition.id + " updated!");
                                        }
                                    });

                                }
                            });
                        }
                    });
                }
            });
        };

        return viewModelUpdater;
    }]);
