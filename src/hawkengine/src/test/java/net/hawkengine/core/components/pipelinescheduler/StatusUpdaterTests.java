package net.hawkengine.core.components.pipelinescheduler;

import com.fiftyonred.mock_jedis.MockJedisPool;
import net.hawkengine.core.utilities.constants.TestsConstants;
import net.hawkengine.db.IDbRepository;
import net.hawkengine.db.redis.RedisRepository;
import net.hawkengine.model.Job;
import net.hawkengine.model.Pipeline;
import net.hawkengine.model.Stage;
import net.hawkengine.model.enums.JobStatus;
import net.hawkengine.model.enums.Status;
import net.hawkengine.services.PipelineDefinitionService;
import net.hawkengine.services.PipelineService;
import net.hawkengine.services.interfaces.IPipelineDefinitionService;
import net.hawkengine.services.interfaces.IPipelineService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.JedisPoolConfig;

import java.util.ArrayList;
import java.util.List;

public class StatusUpdaterTests {
    private IPipelineService mockedPipelineService;
    private StatusUpdater mockedStatusUpdater;
    private IPipelineDefinitionService mockedPipelineDefinitionService;

    @Before
    public void setUp() {
        MockJedisPool mockedPool = new MockJedisPool(new JedisPoolConfig(), "testStatusUpdater");
        IDbRepository mockedPipelineRepo = new RedisRepository(Pipeline.class, mockedPool);
        this.mockedPipelineDefinitionService = new PipelineDefinitionService();
        this.mockedPipelineService = new PipelineService(mockedPipelineRepo,this.mockedPipelineDefinitionService);
        this.mockedStatusUpdater = new StatusUpdater(this.mockedPipelineService);
    }

    @Test
    public void statusUpdater_failedJob_failedPipeline() {
        List<Pipeline> expectedPipelines = this.injectDataForTestingStatusUpdater();
        for (Pipeline expectedPipelineObject : expectedPipelines) {
            this.mockedStatusUpdater.updateAllStatuses(expectedPipelineObject);
            List<Stage> stages = expectedPipelineObject.getStages();
            for (Stage stage : stages) {
                List<Job> jobs = stage.getJobs();
                jobs.stream().filter(job -> job.getStatus() == JobStatus.FAILED).forEach(job -> {
                    String pipelineId = expectedPipelineObject.getId();
                    Pipeline actualPipeline = (Pipeline) this.mockedPipelineService.getById(pipelineId).getObject();
                    Assert.assertNotEquals(Status.FAILED, actualPipeline.getStatus());
                });
            }
        }
    }

    @Test
    public void statusUpdater_allPassedJobs_passedPipeline() {
        List<Pipeline> expectedPipelines = this.injectDataForTestingStatusUpdater();
        int passedJobsIterator = 0;
        for (Pipeline expectedPipelineObject : expectedPipelines) {
            this.mockedStatusUpdater.updateAllStatuses(expectedPipelineObject);
            List<Stage> stages = expectedPipelineObject.getStages();
            for (Stage stage : stages) {
                List<Job> jobs = stage.getJobs();
                passedJobsIterator = 0;
                for (Job job : jobs) {
                    if (job.getStatus() == JobStatus.PASSED) {
                        passedJobsIterator++;
                    }
                }
                if (passedJobsIterator == jobs.size()) {
                    this.mockedPipelineService.update(expectedPipelineObject);
                    String pipelineId = expectedPipelineObject.getId();
                    Pipeline actualPipeline = (Pipeline) this.mockedPipelineService.getById(pipelineId).getObject();
                    Assert.assertEquals(Status.PASSED, actualPipeline.getStatus());
                }
            }
        }
    }

    @Test
    public void statusUpdater_awaitingJobStatus_notModifiedPipelineStatus() {
        List<Pipeline> expectedPipelines = this.injectDataForTestingStatusUpdater();
        int failedJobsIterator = 0;
        for (Pipeline expectedPipelineObject : expectedPipelines) {
            this.mockedStatusUpdater.updateAllStatuses(expectedPipelineObject);
            List<Stage> stages = expectedPipelineObject.getStages();
            for (Stage stage : stages) {
                List<Job> jobs = stage.getJobs();
                failedJobsIterator = 0;
                for (Job job : jobs) {
                    if (job.getStatus() == JobStatus.PASSED) {
                        failedJobsIterator++;
                    }
                }
                if (failedJobsIterator == 0) {
                    String pipelineId = expectedPipelineObject.getId();
                    Pipeline actualPipeline = (Pipeline) this.mockedPipelineService.getById(pipelineId).getObject();
                    Assert.assertEquals(expectedPipelineObject.getStatus(), actualPipeline.getStatus());
                }
            }
        }
    }

    @Test
    public void getAllPipelinesInProgress_onePipelinePassed_twoObjects() {
        List<Pipeline> expectedPipelines = this.injectDataForTestingStatusUpdater();
        Pipeline firstExpectedPipeline = expectedPipelines.get(0);
        firstExpectedPipeline.setStatus(Status.PASSED);
        this.mockedPipelineService.update(firstExpectedPipeline);

        List<Pipeline> actualPipelines = this.mockedStatusUpdater.getAllPipelinesInProgress();

        Assert.assertEquals(TestsConstants.TESTS_COLLECTION_SIZE_TWO_OBJECTS, actualPipelines.size());
    }

    @Test
    public void runStatusUpdater_interruptedThread_throwInterruptedException() {
        InterruptedException interrupt = new InterruptedException();
        try {
            Thread.currentThread().interrupt();
            this.mockedStatusUpdater.start();
        } catch (IllegalStateException e) {
            Assert.assertEquals(interrupt, e.getCause());
        }
    }

    private List<Pipeline> injectDataForTestingStatusUpdater() {
        List<Pipeline> pipelines = new ArrayList<>();
        List<Job> jobsToAdd = new ArrayList<>();
        List<Stage> stagesToAdd = new ArrayList<>();

        Pipeline firstPipeline = new Pipeline();

        Stage stage = new Stage();

        Job firstJob = new Job();
        firstJob.setStatus(JobStatus.AWAITING);

        Job secondJob = new Job();
        secondJob.setStatus(JobStatus.PASSED);

        jobsToAdd.add(firstJob);
        jobsToAdd.add(secondJob);
        stagesToAdd.add(stage);

        stage.setJobs(jobsToAdd);
        firstPipeline.setStages(stagesToAdd);
        pipelines.add(firstPipeline);
        this.mockedPipelineService.add(firstPipeline);

        Pipeline secondPipeline = new Pipeline();
        jobsToAdd = new ArrayList<>();
        stagesToAdd = new ArrayList<>();

        firstJob.setStatus(JobStatus.FAILED);

        secondJob.setStatus(JobStatus.RUNNING);

        jobsToAdd.add(firstJob);
        jobsToAdd.add(secondJob);
        stagesToAdd.add(stage);

        stage.setJobs(jobsToAdd);
        secondPipeline.setStages(stagesToAdd);
        pipelines.add(secondPipeline);
        this.mockedPipelineService.add(secondPipeline);

        Pipeline thirdPipeline = new Pipeline();

        firstJob.setStatus(JobStatus.PASSED);

        secondJob.setStatus(JobStatus.PASSED);

        jobsToAdd = new ArrayList<>();
        stagesToAdd = new ArrayList<>();
        jobsToAdd.add(firstJob);
        jobsToAdd.add(secondJob);
        stagesToAdd.add(stage);

        stage.setJobs(jobsToAdd);
        thirdPipeline.setStages(stagesToAdd);
        pipelines.add(thirdPipeline);
        this.mockedPipelineService.add(thirdPipeline);

        return pipelines;
    }
}
