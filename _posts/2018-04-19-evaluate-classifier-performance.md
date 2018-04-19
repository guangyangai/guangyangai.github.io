An important concept in evaluating a classifier is confusion matrix. Confusion matrix is a symmetric matrix showing the number 
of correct and wrong classification on a set of test data for which the true values are known. 

confusion matrix:

| |					predicted negatives  |   predicted postives |
| ------------- |:-------------:| 
| actual negatives   | # of true negatives     |# of false positves

|actual positves   | # of false negatives     |# of true positives 

Here in the matrix, negatives means your classifier returns a False boolean value and postive means your classifier returns a True boolean value.  

###Metrics options

1. ROC curve (AUC score): 
ROC always use row-wise metric in the confusion matrix, it plots TPR (true positive rate) against FPR (false postive rate).

TPR is ratio of instances that are correctly classified as postives out of the actual positives, it is a metric based 
on the row of actual postives in the confusion matrix.
TPR = # of true postives / (# of true postives + # of false negatives) 

FPR is ratio of instances that are incorrectly classified as postives out of all the actual negatives, it is a metric based on the row of actual negative in the confusion matrix.
FPR = # of false postives / (# of false postives + # of true negatives) = 1 - specificity 


2. PR curve (recall score, precision score)
PR curve plots recall score against precision score, it uses both column-wise metric and row-wise metric in the confusion matrix. 
Recall score is a metric based on row of actual postives in the confusion matrix. It is actually just a different name of TPR. On the other hand, precision score is a metric based on column of predicted positves, it is the ratio of instances that are correctly classified as positive out of the predicted positves. 

Precision score = # of true postives / (# of true postives + # of false positives) 

3. f1 score: harmonic average between recall score and precision score
f1 score favors classifiers that balances recall score and precision score


###Choice of metrics

Choice of metric depends on the application that whether you care more about false negatives or false positives, or the disparity between your actual postives samples and actual negative samples. 

You should choose PR curve if positves samples are rare or you care more about false positives (i.e. you care more about precision instead of false positive rate) in your application, and choose ROC curve otherwise. 

If you want to classify bad event brutally (meaning clasifier returns True/Positive if it detects a bad event, e.g. crime) , you care more about false negatives becuase you don't want to miss any bad event, but the compromise here is that some innocent instances would be falsely claimed as bad by your classifier. 

If you want to classify good event safely (meaning classifer returns True/Negative if it detects a good event, e.g. safe video for children to watch), you care more about false positives because you to prevent any bad event sneaking in your renderings. However, the compromise here is that you could possibly good videos with interesting contents for children to watch. 
