"""
Quizzes for Skills 15 through 20:
15. ML evaluation metrics
16. Excel & spreadsheet analytics
17. Data visualisation basics
18. Business communication (email, reports)
19. Basic accounting (debit/credit, GST basics)
20. Project management basics (Agile, Scrum)
"""

def get_skills_15_to_20():
    return [
        # 15. ML evaluation metrics
        {
            "id": "ml-evaluation-metrics",
            "name": "ML evaluation metrics",
            "displayName": "Machine Learning Evaluation Metrics & Diagnostic Audits",
            "category": "AI / ML & Data Science",
            "description": "Precision, recall, F1-score, confusion matrix, ROC-AUC, MSE/MAE, and class imbalance trade-offs.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the formula for Classification Accuracy?",
                    "options": [
                        "(True Positives + True Negatives) / Total Predictions",
                        "True Positives / (True Positives + False Positives)",
                        "True Positives / (True Positives + False Negatives)",
                        "False Positives / False Negatives"
                    ],
                    "correctIndex": 0,
                    "explanation": "Accuracy measures the proportion of total correct predictions (both positive and negative) over all instances."
                },
                {
                    "id": 2,
                    "question": "Why is Accuracy a misleading metric for severely imbalanced datasets (e.g. 99% benign transactions, 1% fraudulent)?",
                    "options": [
                        "A naive model that always predicts 'benign' achieves 99% accuracy while detecting zero fraud cases.",
                        "Accuracy requires dividing by zero.",
                        "Accuracy cannot be calculated on computers.",
                        "Accuracy is only defined for regression problems."
                    ],
                    "correctIndex": 0,
                    "explanation": "The 'accuracy paradox' occurs when a model achieves high accuracy simply by predicting the majority class while completely failing on the minority class of interest."
                },
                {
                    "id": 3,
                    "question": "What does 'Precision' measure in classification?",
                    "options": [
                        "Out of all instances predicted as Positive, what fraction were actually Positive (TP / (TP + FP)).",
                        "Out of all actual Positive instances, what fraction were detected.",
                        "The time taken to train the model.",
                        "The percentage of true negatives."
                    ],
                    "correctIndex": 0,
                    "explanation": "Precision answers: 'When the model predicts positive, how often is it correct?' (Minimizes False Positives)."
                },
                {
                    "id": 4,
                    "question": "What does 'Recall' (Sensitivity) measure?",
                    "options": [
                        "Out of all actual true Positive instances in reality, what fraction did the model successfully identify (TP / (TP + FN)).",
                        "The percentage of false alarms.",
                        "How quickly a user remembers their password.",
                        "The total number of negative predictions."
                    ],
                    "correctIndex": 0,
                    "explanation": "Recall answers: 'Did we catch all the actual positives?' (Minimizes False Negatives, critical in medical diagnostics and fraud)."
                },
                {
                    "id": 5,
                    "question": "What is the F1-Score?",
                    "options": [
                        "The Harmonic Mean of Precision and Recall (2 * (Precision * Recall) / (Precision + Recall)).",
                        "The arithmetic average of Accuracy and Loss.",
                        "The fastest speed of a Formula 1 racing car.",
                        "The difference between True Positives and False Positives."
                    ],
                    "correctIndex": 0,
                    "explanation": "The F1-score provides a balanced single metric between Precision and Recall, heavily penalizing extreme disparities."
                },
                {
                    "id": 6,
                    "question": "What are the four components of a binary Confusion Matrix?",
                    "options": [
                        "True Positives (TP), True Negatives (TN), False Positives (FP), False Negatives (FN)",
                        "Inputs, Outputs, Weights, Biases",
                        "Mean, Median, Mode, Variance",
                        "Train, Validation, Test, Loss"
                    ],
                    "correctIndex": 0,
                    "explanation": "A confusion matrix tabulates ground truth versus model predictions across all 4 outcome combinations."
                },
                {
                    "id": 7,
                    "question": "What is a False Positive (Type I Error)?",
                    "options": [
                        "The model predicted Positive, but the actual reality was Negative (e.g., spam filter classifying an important email as spam).",
                        "The model predicted Negative, but reality was Positive.",
                        "A correctly identified positive.",
                        "A correct negative identification."
                    ],
                    "correctIndex": 0,
                    "explanation": "A False Positive is an incorrect rejection of a true null hypothesis (a false alarm)."
                },
                {
                    "id": 8,
                    "question": "What is a False Negative (Type II Error)?",
                    "options": [
                        "The model predicted Negative, but the actual reality was Positive (e.g., diagnostic test missing a cancer patient).",
                        "The model predicted Positive, but reality was Negative.",
                        "A correct diagnosis.",
                        "A missing database index."
                    ],
                    "correctIndex": 0,
                    "explanation": "A False Negative is failing to detect an event that is actually present (a missed detection)."
                },
                {
                    "id": 9,
                    "question": "What does the ROC (Receiver Operating Characteristic) curve plot?",
                    "options": [
                        "True Positive Rate (Sensitivity / Recall) on the y-axis against False Positive Rate (1 - Specificity) on the x-axis across various classification thresholds.",
                        "Accuracy vs Loss.",
                        "Training time vs Epochs.",
                        "Cost vs Revenue."
                    ],
                    "correctIndex": 0,
                    "explanation": "The ROC curve illustrates the diagnostic ability of a binary classifier as its discrimination threshold is varied."
                },
                {
                    "id": 10,
                    "question": "What does an Area Under the ROC Curve (ROC-AUC) score of 0.5 represent?",
                    "options": [
                        "Performance equivalent to pure random guessing (no discrimination power).",
                        "Perfect classification with 100% accuracy.",
                        "Severe overfitting.",
                        "An inverted model with 0% error."
                    ],
                    "correctIndex": 0,
                    "explanation": "An AUC of 0.5 denotes random coin-toss performance; an AUC of 1.0 indicates perfect separation."
                },
                {
                    "id": 11,
                    "question": "In Regression problems, how does Mean Squared Error (MSE) differ from Mean Absolute Error (MAE)?",
                    "options": [
                        "MSE squares the error terms, penalizing large outlier errors much more severely than MAE.",
                        "MAE can only be positive; MSE can be negative.",
                        "MSE is used for categories; MAE is used for continuous numbers.",
                        "MAE cannot be calculated in Python."
                    ],
                    "correctIndex": 0,
                    "explanation": "Squaring in MSE amplifies the penalty for large prediction discrepancies, making it sensitive to outliers."
                },
                {
                    "id": 12,
                    "question": "What does R-squared (Coefficient of Determination) represent in regression analysis?",
                    "options": [
                        "The proportion of the variance in the dependent variable that is predictable from the independent variables (0 to 1).",
                        "The radius of the data scatter plot.",
                        "The square root of the accuracy percentage.",
                        "The execution time of the regression query."
                    ],
                    "correctIndex": 0,
                    "explanation": "R-squared measures goodness of fit; R^2 = 0.85 means 85% of target variance is explained by the model."
                },
                {
                    "id": 13,
                    "question": "What is Specificity (True Negative Rate)?",
                    "options": [
                        "True Negatives / (True Negatives + False Positives)",
                        "True Positives / Total",
                        "False Positives / False Negatives",
                        "Accuracy - Precision"
                    ],
                    "correctIndex": 0,
                    "explanation": "Specificity measures the proportion of actual negatives that were correctly identified as negative."
                },
                {
                    "id": 14,
                    "question": "In a cancer screening system, which error type is more catastrophic to minimize at all costs?",
                    "options": [
                        "False Negatives (telling a patient with cancer that they are healthy).",
                        "False Positives (ordering a follow-up biopsy for a healthy patient).",
                        "Both errors are strictly equal in impact.",
                        "Neither error matters in medicine."
                    ],
                    "correctIndex": 0,
                    "explanation": "Missing a life-threatening illness (False Negative) has lethal consequences, so high Recall is prioritized over Precision in medical diagnostics."
                },
                {
                    "id": 15,
                    "question": "In an automated spam filter, which error is more annoying to end users?",
                    "options": [
                        "False Positives (marking a critical job offer or flight ticket as spam).",
                        "False Negatives (letting a minor spam advertisement slip into the inbox).",
                        "Both are equally harmful.",
                        "Spam filters do not produce errors."
                    ],
                    "correctIndex": 0,
                    "explanation": "Users tolerate occasional spam in their inbox (FN) but are infuriated when legitimate important emails vanish into spam folders (FP), requiring high Precision."
                },
                {
                    "id": 16,
                    "question": "What does Root Mean Squared Error (RMSE) accomplish over standard MSE?",
                    "options": [
                        "Taking the square root converts the error metric back into the exact same physical units as the target variable.",
                        "Eliminates negative numbers.",
                        "Multiplies the error by 100.",
                        "Normalizes the error between 0 and 1."
                    ],
                    "correctIndex": 0,
                    "explanation": "If predicting house prices in dollars, MSE is in dollars squared ($^2); RMSE brings the unit back to dollars ($)."
                },
                {
                    "id": 17,
                    "question": "What is the Precision-Recall (PR) Curve preferred over ROC for?",
                    "options": [
                        "Heavily imbalanced datasets where the positive class is extremely rare.",
                        "Datasets with zero features.",
                        "Linear regression models only.",
                        "Visualizing server temperatures."
                    ],
                    "correctIndex": 0,
                    "explanation": "When the negative class is massive, ROC curves can paint an artificially rosy picture; PR curves focus strictly on the rare positive class."
                },
                {
                    "id": 18,
                    "question": "What is Log Loss (Cross-Entropy Loss) evaluating in probabilistic classifiers?",
                    "options": [
                        "The uncertainty of your probabilities; it heavily penalizes confident but incorrect predictions.",
                        "The time taken to write log files to disk.",
                        "The logarithm of the dataset row count.",
                        "The loss of internet connectivity during training."
                    ],
                    "correctIndex": 0,
                    "explanation": "If a model predicts 0.99 probability for class A, but the actual class is B, log loss imposes an enormous mathematical penalty."
                },
                {
                    "id": 19,
                    "question": "What is Cohen's Kappa used for?",
                    "options": [
                        "Measuring inter-rater reliability or classification agreement while taking into account agreement occurring by chance.",
                        "Measuring the volume of data in gigabytes.",
                        "Calculating CPU temperature.",
                        "Testing network ping latency."
                    ],
                    "correctIndex": 0,
                    "explanation": "Cohen's Kappa evaluates how well two annotators or a model and ground truth agree beyond random chance."
                },
                {
                    "id": 20,
                    "question": "What does Mean Absolute Percentage Error (MAPE) measure?",
                    "options": [
                        "The average magnitude of errors expressed as a percentage of the actual values.",
                        "The percentage of correct predictions.",
                        "The battery life of a laptop.",
                        "The percentage of memory used by Python."
                    ],
                    "correctIndex": 0,
                    "explanation": "MAPE expresses accuracy as a relative percentage ratio (e.g. error is 4.5% of actual revenue)."
                }
            ]
        },

        # 16. Excel & spreadsheet analytics
        {
            "id": "excel-analytics",
            "name": "Excel & spreadsheet analytics",
            "displayName": "Excel & Spreadsheet Data Analytics",
            "category": "Data Analysis & Business Tools",
            "description": "VLOOKUP vs XLOOKUP, INDEX/MATCH, Pivot Tables, SUMIFS/COUNTIFS, cell references, and data validation.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the major architectural advantage of XLOOKUP over the legacy VLOOKUP function in Excel?",
                    "options": [
                        "XLOOKUP can search to the left, defaults to exact match without sorting, and does not break when columns are inserted or deleted.",
                        "VLOOKUP can only look up dates.",
                        "XLOOKUP is only available on Linux.",
                        "XLOOKUP requires a GPU to run."
                    ],
                    "correctIndex": 0,
                    "explanation": "XLOOKUP replaces both VLOOKUP and HLOOKUP, works in any direction, defaults to exact match, and uses decoupled return ranges."
                },
                {
                    "id": 2,
                    "question": "In Excel formulas, what does the dollar sign ($) in a cell reference like '$B$4' indicate?",
                    "options": [
                        "An Absolute Reference that locks both the column (B) and row (4) so they do not shift when the formula is copied.",
                        "The cell contains US Dollar currency values.",
                        "The cell is encrypted with a password.",
                        "The cell is formatted as a header."
                    ],
                    "correctIndex": 0,
                    "explanation": "$ locks coordinates during copy/fill; $A$1 is fully absolute, A$1 is row-locked, and $A1$ is column-locked."
                },
                {
                    "id": 3,
                    "question": "What is a Pivot Table primarily used for in spreadsheet analytics?",
                    "options": [
                        "Quickly summarizing, aggregating, sorting, and slicing large multi-column datasets into cross-tabulated reports without writing formulas.",
                        "Rotating the computer monitor 90 degrees.",
                        "Converting Excel files into PDF.",
                        "Running SQL queries directly in BIOS."
                    ],
                    "correctIndex": 0,
                    "explanation": "Pivot tables allow interactive restructuring and aggregation (sums, averages, counts) across multidimensional data."
                },
                {
                    "id": 4,
                    "question": "Which combination of functions has historically been used by advanced Excel analysts as a faster, more flexible alternative to VLOOKUP?",
                    "options": ["INDEX and MATCH", "SUM and AVERAGE", "LEFT and RIGHT", "IF and OR"],
                    "correctIndex": 0,
                    "explanation": "INDEX returns a value from an array given row/col indices; MATCH finds the relative index of a lookup item, working bidirectionally."
                },
                {
                    "id": 5,
                    "question": "Which function calculates the total sum of sales in Column C ONLY for orders where Region in Column A is 'North' AND Category in Column B is 'Electronics'?",
                    "options": [
                        "=SUMIFS(C:C, A:A, \"North\", B:B, \"Electronics\")",
                        "=SUMIF(A:A, \"North\", C:C)",
                        "=COUNTIFS(C:C, \"North\", B:B, \"Electronics\")",
                        "=TOTAL(C:C, A:A=\"North\")"
                    ],
                    "correctIndex": 0,
                    "explanation": "SUMIFS supports multiple criteria; the sum_range comes first, followed by pairs of criteria_range and criteria."
                },
                {
                    "id": 6,
                    "question": "What does the function '=COUNTIF(range, \">100\")' do?",
                    "options": [
                        "Counts the number of cells within the specified range whose values are strictly greater than 100.",
                        "Calculates the sum of all cells above 100.",
                        "Deletes cells less than 100.",
                        "Divides the range by 100."
                    ],
                    "correctIndex": 0,
                    "explanation": "COUNTIF evaluates a single condition and counts how many cells satisfy the boolean test."
                },
                {
                    "id": 7,
                    "question": "What does the Excel error '#N/A' typically indicate in a lookup formula?",
                    "options": [
                        "No value is available because the lookup value was not found in the search range.",
                        "The formula attempted to divide a number by zero.",
                        "The column width is too narrow to display the number.",
                        "The spreadsheet file is corrupt."
                    ],
                    "correctIndex": 0,
                    "explanation": "#N/A means 'Not Available' – the lookup item does not exist within the specified table or range."
                },
                {
                    "id": 8,
                    "question": "What error occurs when a formula attempts to divide a numeric value by zero or an empty cell?",
                    "options": ["#DIV/0!", "#VALUE!", "#REF!", "#NAME?"],
                    "correctIndex": 0,
                    "explanation": "#DIV/0! occurs when a formula attempts mathematical division by zero."
                },
                {
                    "id": 9,
                    "question": "What does the function '=TRIM(A1)' do?",
                    "options": [
                        "Removes all leading and trailing spaces from text, as well as redundant multiple spaces between words, leaving only single spaces.",
                        "Cuts the text length in half.",
                        "Deletes all vowels from the cell.",
                        "Truncates numbers to two decimal places."
                    ],
                    "correctIndex": 0,
                    "explanation": "TRIM cleans up dirty text by stripping extraneous spaces from imported database records."
                },
                {
                    "id": 10,
                    "question": "What is Data Validation in Excel used for?",
                    "options": [
                        "Restricting the type of data or values that users can enter into a given cell (e.g., dropdown lists, dates within range, numbers > 0).",
                        "Verifying user passport details.",
                        "Scanning for computer viruses.",
                        "Compressing spreadsheet file size."
                    ],
                    "correctIndex": 0,
                    "explanation": "Data validation enforces input hygiene through dropdown selection lists and input bounds checking."
                },
                {
                    "id": 11,
                    "question": "What does the function '=CONCATENATE(A1, \" \", B1)' or '=A1 & \" \" & B1' do?",
                    "options": [
                        "Combines the text strings from cell A1, a space, and cell B1 into a single text output.",
                        "Adds the mathematical values of A1 and B1.",
                        "Compares if A1 is equal to B1.",
                        "Deletes both cells."
                    ],
                    "correctIndex": 0,
                    "explanation": "Concatenation joins multiple strings together into one continuous text block."
                },
                {
                    "id": 12,
                    "question": "What is the purpose of Conditional Formatting?",
                    "options": [
                        "Automatically applying visual styling (colors, data bars, icon sets) to cells based on specified rules or values.",
                        "Formatting the hard drive on condition.",
                        "Translating formulas into French.",
                        "Hiding rows when the computer is locked."
                    ],
                    "correctIndex": 0,
                    "explanation": "Conditional formatting highlights outliers, top performers, or negative values automatically using visual styles."
                },
                {
                    "id": 13,
                    "question": "What will '=IF(A1 > 50, \"Pass\", \"Fail\")' return if cell A1 contains the number 50?",
                    "options": ["\"Fail\"", "\"Pass\"", "50", "TRUE"],
                    "correctIndex": 0,
                    "explanation": "50 is not strictly greater than 50 (50 > 50 is False), so the formula returns the false-branch: \"Fail\"."
                },
                {
                    "id": 14,
                    "question": "What is Excel Power Query primarily used for?",
                    "options": [
                        "Extracting, transforming, cleaning, and reshaping data (ETL) from multiple disparate external sources before loading into spreadsheets.",
                        "Increasing computer processor wattage.",
                        "Designing PowerPoint slides from Excel.",
                        "Playing 3D video games inside Excel."
                    ],
                    "correctIndex": 0,
                    "explanation": "Power Query provides an automated data transformation and ETL engine inside Excel and Power BI."
                },
                {
                    "id": 15,
                    "question": "What does the function '=IFERROR(VLOOKUP(...), \"Not Found\")' do?",
                    "options": [
                        "Evaluates the VLOOKUP and cleanly catches errors (like #N/A), displaying 'Not Found' instead of an ugly error banner.",
                        "Forces the formula to produce an error.",
                        "Stops the calculation permanently.",
                        "Sends an email alert to the user."
                    ],
                    "correctIndex": 0,
                    "explanation": "IFERROR traps formula errors and substitutes a friendly fallback value."
                },
                {
                    "id": 16,
                    "question": "What does the Excel shortcut 'Ctrl + Shift + L' (or Cmd + Shift + F on Mac) toggle?",
                    "options": [
                        "AutoFilter arrows on the selected table header row.",
                        "Locks the computer screen.",
                        "Deletes the current worksheet.",
                        "Highlights the entire document in yellow."
                    ],
                    "correctIndex": 0,
                    "explanation": "Ctrl + Shift + L toggles automatic filter dropdown arrows across data columns."
                },
                {
                    "id": 17,
                    "question": "What does a circular reference warning indicate in a spreadsheet?",
                    "options": [
                        "A formula refers to its own cell directly or indirectly, creating an infinite calculation loop.",
                        "A pie chart has been created.",
                        "The cells are shaped like circles.",
                        "The computer is low on memory."
                    ],
                    "correctIndex": 0,
                    "explanation": "Circular references occur when cell A1 contains a formula that includes A1 in its own computation."
                },
                {
                    "id": 18,
                    "question": "What does the function '=TEXT(A1, \"yyyy-mm-dd\")' do?",
                    "options": [
                        "Converts a date or serial number in A1 into text formatted in ISO standard Year-Month-Day representation.",
                        "Deletes the date.",
                        "Calculates age in months.",
                        "Translates date into roman numerals."
                    ],
                    "correctIndex": 0,
                    "explanation": "The TEXT function formats numeric or date values into customized text strings according to format codes."
                },
                {
                    "id": 19,
                    "question": "What is the purpose of 'Freeze Panes' in Excel?",
                    "options": [
                        "Keeping header rows or key columns visible on the screen while scrolling through thousands of rows of data.",
                        "Stopping all calculations to save battery.",
                        "Preventing users from opening the file.",
                        "Locking formulas with a password."
                    ],
                    "correctIndex": 0,
                    "explanation": "Freeze Panes locks top header rows and leftmost identification columns in place during navigation."
                },
                {
                    "id": 20,
                    "question": "What is a Sparkline in modern spreadsheets?",
                    "options": [
                        "A tiny, lightweight chart placed entirely within a single cell that provides a quick visual trend of data.",
                        "A software animation that flashes stars on the screen.",
                        "A formula that computes electrical voltage.",
                        "A tool to send messages between users."
                    ],
                    "correctIndex": 0,
                    "explanation": "Sparklines are miniature word-sized charts fitting in a single table cell to show trends at a glance."
                }
            ]
        },

        # 17. Data visualisation basics
        {
            "id": "data-visualisation",
            "name": "Data visualisation basics",
            "displayName": "Data Visualization & Dashboard Design Principles",
            "category": "Data Analysis & Business Tools",
            "description": "Chart types (bar vs line vs scatter vs box), color accessibility, avoiding chart junk, distribution vs trend, and storytelling.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which chart type is best suited for showing trends and changes in a continuous metric over a continuous time period?",
                    "options": ["Line Chart", "Pie Chart", "Scatter Plot without lines", "Treemap"],
                    "correctIndex": 0,
                    "explanation": "Line charts connect sequential data points, making them optimal for visualizing continuous temporal trends."
                },
                {
                    "id": 2,
                    "question": "Why do expert data visualization analysts strongly advise against using 3D Pie Charts?",
                    "options": [
                        "Perspective distortion makes slices in the foreground appear artificially larger than slices in the background, misleading perception.",
                        "3D charts require special red-blue glasses.",
                        "Web browsers cannot render 3D charts.",
                        "3D charts cannot be printed on paper."
                    ],
                    "correctIndex": 0,
                    "explanation": "Human visual perception struggles to judge angles and areas in 3D perspective; flat bar charts provide much clearer comparisons."
                },
                {
                    "id": 3,
                    "question": "Which chart type is ideal for displaying the correlation and relationship between two continuous numerical variables (e.g. Height vs Weight)?",
                    "options": ["Scatter Plot", "Stacked Bar Chart", "Pie Chart", "Radar Chart"],
                    "correctIndex": 0,
                    "explanation": "Scatter plots place one variable on the X-axis and another on the Y-axis, clearly exposing correlations, clusters, and outliers."
                },
                {
                    "id": 4,
                    "question": "What does a Box Plot (Box-and-Whisker Plot) visualize about a numerical distribution?",
                    "options": [
                        "The minimum, first quartile (Q1), median (Q2), third quartile (Q3), maximum, and potential outliers.",
                        "Only the average and standard deviation.",
                        "The names of data collectors.",
                        "The speed of database queries."
                    ],
                    "correctIndex": 0,
                    "explanation": "A box plot summarizes the five-number summary of a dataset, revealing skewness and outliers concisely."
                },
                {
                    "id": 5,
                    "question": "What is a Histogram used for?",
                    "options": [
                        "Visualizing the frequency distribution of a continuous numerical variable by binning data into adjacent non-overlapping intervals.",
                        "Comparing discrete categorical labels with large gaps.",
                        "Displaying chronological project milestones on a calendar.",
                        "Plotting global geographical maps."
                    ],
                    "correctIndex": 0,
                    "explanation": "Histograms group continuous data into discrete bins and show frequency counts through touching vertical bars."
                },
                {
                    "id": 6,
                    "question": "What term did Edward Tufte coin to describe decorative visual elements in charts that do not convey data and distract the viewer?",
                    "options": ["Chartjunk", "Data Density", "Visual Grammar", "Pixel Bloat"],
                    "correctIndex": 0,
                    "explanation": "Chartjunk refers to unnecessary visual elements (heavy 3D effects, moiré patterns, excessive gridlines) that obscure communication."
                },
                {
                    "id": 7,
                    "question": "What is an essential best practice for making charts accessible to colorblind users (e.g. red-green colorblindness)?",
                    "options": [
                        "Using colorblind-friendly palettes (like Viridis, ColorBrewer) and reinforcing color coding with redundant shapes, patterns, or direct labels.",
                        "Using only bright red and dark green side by side.",
                        "Eliminating all text labels.",
                        "Making all charts black and white exclusively."
                    ],
                    "correctIndex": 0,
                    "explanation": "Color should never be the sole conveyor of information; shapes, patterns, and accessible palettes guarantee readability."
                },
                {
                    "id": 8,
                    "question": "Why is truncating the Y-axis (not starting at zero) on a Bar Chart considered a misleading visualization technique?",
                    "options": [
                        "Because bar charts encode data as physical height/length; truncating the baseline exaggerates tiny differences into appearing massive.",
                        "Because computers cannot calculate zero.",
                        "Because it makes the chart file size smaller.",
                        "It is not misleading; all bar charts should truncate the axis."
                    ],
                    "correctIndex": 0,
                    "explanation": "Bar charts rely on proportional height; truncating the Y-axis distorts visual proportionality, misleading the audience."
                },
                {
                    "id": 9,
                    "question": "Which visualization type is best suited for showing parts of a whole across hierarchical categorical levels with nested rectangles?",
                    "options": ["Treemap", "Line Chart", "Histogram", "Scatter Plot"],
                    "correctIndex": 0,
                    "explanation": "Treemaps display hierarchical data as a set of nested rectangles whose area is proportional to a quantitative metric."
                },
                {
                    "id": 10,
                    "question": "What is a Heatmap primarily used to visualize?",
                    "options": [
                        "A two-dimensional grid where individual values are represented by color gradients or intensities.",
                        "Weather forecasting temperatures exclusively.",
                        "The battery life of servers.",
                        "Text documents."
                    ],
                    "correctIndex": 0,
                    "explanation": "Heatmaps use color gradients across 2D matrices to highlight intensity, density, correlations, or cross-tabulated metrics."
                },
                {
                    "id": 11,
                    "question": "What is the primary purpose of an Executive Dashboard?",
                    "options": [
                        "Presenting key performance indicators (KPIs) and operational metrics concisely at a glance to inform strategic decision-making.",
                        "Showing every raw database row in full text.",
                        "Replacing email applications.",
                        "Generating artistic abstract graphics."
                    ],
                    "correctIndex": 0,
                    "explanation": "Dashboards distill complex operational metrics into high-level visual summaries for quick situational awareness."
                },
                {
                    "id": 12,
                    "question": "When comparing categories with very long descriptive labels (e.g., 'Department of Information Technology Support Services'), which chart layout is easiest to read?",
                    "options": [
                        "Horizontal Bar Chart (labels read naturally left-to-right on the Y-axis)",
                        "Vertical Column Chart with 90-degree rotated labels",
                        "Pie Chart with 50 slices",
                        "Radar chart"
                    ],
                    "correctIndex": 0,
                    "explanation": "Horizontal bar charts accommodate long text labels along the vertical axis without awkward diagonal or vertical rotations."
                },
                {
                    "id": 13,
                    "question": "What is the Data-to-Ink Ratio proposed by Edward Tufte?",
                    "options": [
                        "The proportion of visual ink/pixels dedicated to displaying actual data information compared to the total ink used in the graphic.",
                        "The cost of printing paper per page.",
                        "The thickness of chart borders.",
                        "The percentage of white space on a page."
                    ],
                    "correctIndex": 0,
                    "explanation": "Tufte argues that good design maximizes the data-ink ratio: erase non-data-ink and eliminate redundant data-ink."
                },
                {
                    "id": 14,
                    "question": "What is a Choropleth Map?",
                    "options": [
                        "A thematic geographical map where statistical variables are visualized through shading or color patterns across defined geographic areas.",
                        "A map showing only elevation lines.",
                        "A street road map for self-driving cars.",
                        "A star constellation map."
                    ],
                    "correctIndex": 0,
                    "explanation": "Choropleths color-code geographic areas (states, countries) according to aggregate metrics like population or voter turnout."
                },
                {
                    "id": 15,
                    "question": "What is the primary danger of plotting too many series (e.g. 25 lines) on a single Line Chart?",
                    "options": [
                        "Spaghetti chart syndrome: lines overlap into an unreadable tangle that makes individual interpretation impossible.",
                        "The chart will consume all internet bandwidth.",
                        "The font size increases automatically.",
                        "The computer will crash."
                    ],
                    "correctIndex": 0,
                    "explanation": "Overcrowding line charts produces 'spaghetti charts'; using small multiples or highlighting one focal series is vastly superior."
                },
                {
                    "id": 16,
                    "question": "What is 'Small Multiples' (Trellis Display) in data visualization?",
                    "options": [
                        "A series of small charts using the same scale and axes to facilitate quick comparison across categories without visual clutter.",
                        "Multiplying numbers by small integers.",
                        "Viewing charts on a tiny smartwatch screen.",
                        "A table of multiplication facts."
                    ],
                    "correctIndex": 0,
                    "explanation": "Small multiples place multiple small, consistent charts side-by-side to compare sub-groups without overlapping lines."
                },
                {
                    "id": 17,
                    "question": "What does a Bubble Chart add over a standard 2D Scatter Plot?",
                    "options": [
                        "A third numerical variable encoded through the physical size/area of the circular markers (bubbles).",
                        "Sound effects when clicked.",
                        "An animation of rising water bubbles.",
                        "Color gradients only."
                    ],
                    "correctIndex": 0,
                    "explanation": "Bubble charts plot X, Y, and encode a third dimension in the bubble's area (proportional to radius squared)."
                },
                {
                    "id": 18,
                    "question": "When is a Stacked Bar Chart appropriate to use?",
                    "options": [
                        "When comparing total aggregate amounts across categories while simultaneously showing the relative breakdown of sub-components.",
                        "When plotting continuous time series with millions of points.",
                        "When data contains negative infinity.",
                        "When comparing two unrelated dates."
                    ],
                    "correctIndex": 0,
                    "explanation": "Stacked bars illustrate part-to-whole relationships across categories, though reading middle segments can be harder."
                },
                {
                    "id": 19,
                    "question": "Why should logarithmic scales (Log Scale) be used on certain chart axes?",
                    "options": [
                        "When data spans multiple orders of magnitude (e.g., from 1 to 10,000,000) or illustrates exponential growth rates clearly.",
                        "To hide negative results from stakeholders.",
                        "Because linear scales are illegal in science.",
                        "To compress charts for small phone screens."
                    ],
                    "correctIndex": 0,
                    "explanation": "Log scales convert exponential curves into linear representations and make wide-ranging datasets readable."
                },
                {
                    "id": 20,
                    "question": "What is a Funnel Chart commonly used for in business analytics?",
                    "options": [
                        "Visualizing stage-by-stage attrition and drop-off conversion rates across a progressive linear pipeline (e.g. Sales, Onboarding).",
                        "Calculating engine oil consumption.",
                        "Sorting database files alphabetically.",
                        "Evaluating statistical variance."
                    ],
                    "correctIndex": 0,
                    "explanation": "Funnel charts track conversion drop-offs as users advance through sequential stages of a process."
                }
            ]
        },

        # 18. Business communication (email, reports)
        {
            "id": "business-communication",
            "name": "Business communication (email, reports)",
            "displayName": "Business Communication, Technical Writing & Reporting",
            "category": "Professional Skills",
            "description": "BLUF framework, email etiquette, executive summaries, CC/BCC, active voice, and stakeholder management.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What does the BLUF communication methodology stand for?",
                    "options": [
                        "Bottom Line Up Front — presenting the main conclusion, recommendation, or decision at the very beginning of the message.",
                        "Better Layout Under Formatting.",
                        "Business Language Upon Filing.",
                        "Brief Letters Used Frequently."
                    ],
                    "correctIndex": 0,
                    "explanation": "BLUF places the vital takeaway and decision request in the first paragraph, respecting reader time."
                },
                {
                    "id": 2,
                    "question": "What is the primary purpose of an Executive Summary in a technical business report?",
                    "options": [
                        "Providing a high-level, standalone overview of the problem, key findings, and recommended action for busy decision-makers.",
                        "Listing the resumes of all engineers who worked on the project.",
                        "Printing the entire code repository in appendix.",
                        "Thanking company executives in alphabetical order."
                    ],
                    "correctIndex": 0,
                    "explanation": "Executives often read only the summary; it must be self-contained, concise, and highlight strategic takeaways."
                },
                {
                    "id": 3,
                    "question": "What is the proper etiquette when using the 'BCC' (Blind Carbon Copy) field in email?",
                    "options": [
                        "Protecting recipient privacy when sending an announcement to a large external mailing list, or discreetly archiving to a CRM.",
                        "Secretly talking behind coworkers' backs in daily project threads.",
                        "Sending spam to competitors.",
                        "Bypassing company IT email security policies."
                    ],
                    "correctIndex": 0,
                    "explanation": "BCC conceals recipient email addresses on mass broadcasts, preventing accidental 'Reply All' storms and privacy leaks."
                },
                {
                    "id": 4,
                    "question": "Why is 'Reply All' considered risky or poor etiquette when an email requires action from only one specific person?",
                    "options": [
                        "It clutters the inboxes of dozens of irrelevant stakeholders, creating email fatigue and noise.",
                        "It disconnects the internet connection.",
                        "It deletes the email thread.",
                        "It breaks email encryption."
                    ],
                    "correctIndex": 0,
                    "explanation": "'Reply All' should be reserved exclusively for updates that every person on the thread genuinely needs to know."
                },
                {
                    "id": 5,
                    "question": "Which of the following email subject lines is the most effective and actionable for professional engineering collaboration?",
                    "options": [
                        "[Decision Required] Approval for Database Migration Window — Friday 10 PM IST",
                        "Urgent!!!",
                        "Hey",
                        "Meeting stuff"
                    ],
                    "correctIndex": 0,
                    "explanation": "Effective subject lines include context, urgency tags, and a clear concise topic so recipients can triage immediately."
                },
                {
                    "id": 6,
                    "question": "Why is the Active Voice generally preferred over the Passive Voice in technical writing?",
                    "options": [
                        "Active voice is more direct, concise, and clearly identifies who is performing the action (e.g. 'The server rejected the request' vs 'The request was rejected').",
                        "Passive voice is prohibited by grammar software.",
                        "Active voice makes the document 10 pages longer.",
                        "Passive voice cannot be translated into other languages."
                    ],
                    "correctIndex": 0,
                    "explanation": "Active voice improves clarity and accountability by keeping the subject upfront performing the verb."
                },
                {
                    "id": 7,
                    "question": "What are Meeting Minutes (MoM) primarily recorded for?",
                    "options": [
                        "Documenting key discussions, decisions reached, action items, assigned owners, and committed completion deadlines.",
                        "Recording word-for-word audio transcripts of jokes told during lunch.",
                        "Grading employee performance during the meeting.",
                        "Calculating meeting room air conditioning costs."
                    ],
                    "correctIndex": 0,
                    "explanation": "Minutes of Meeting create alignment and accountability by establishing a shared record of deliverables and owners."
                },
                {
                    "id": 8,
                    "question": "What is the recommended approach when communicating a technical outage or major delay to non-technical stakeholders?",
                    "options": [
                        "Clearly explain the business impact, estimated time to restore, current mitigation steps, and prevention measures in plain language.",
                        "Send a 500-line raw kernel stack trace with no explanation.",
                        "Blame junior team members publicly.",
                        "Refuse to respond to emails until the problem is fixed."
                    ],
                    "correctIndex": 0,
                    "explanation": "Stakeholders care about user impact, estimated resolution timelines, and risk mitigation rather than raw stack traces."
                },
                {
                    "id": 9,
                    "question": "In professional messaging tools (like Slack, Teams), what is the benefit of keeping discussions inside 'Threads'?",
                    "options": [
                        "It keeps primary channel feeds clean and organizes focused context under a single topic.",
                        "It encrypts messages with military security.",
                        "It deletes messages after 24 hours automatically.",
                        "It notifies all 10,000 employees in the company."
                    ],
                    "correctIndex": 0,
                    "explanation": "Threaded discussions prevent multiple conversations from interleaving and polluting the main channel stream."
                },
                {
                    "id": 10,
                    "question": "What does an 'Out of Office' (OOO) automatic auto-responder message ideally include?",
                    "options": [
                        "Return date, expected email check frequency, and point of contact for urgent escalations.",
                        "A list of vacation photos and personal phone numbers.",
                        "A complaints form for senders.",
                        "A generic message saying 'Do not contact me'."
                    ],
                    "correctIndex": 0,
                    "explanation": "Effective OOO messages set realistic response expectations and route urgent blockers to active teammates."
                },
                {
                    "id": 11,
                    "question": "What is the '5 Ws' framework in investigative technical reports?",
                    "options": [
                        "Who, What, When, Where, Why (and How)",
                        "Work, Wait, Watch, Write, Win",
                        "Web, Windows, Wi-Fi, Word, Workspace",
                        "Weight, Width, Width, Width, Watts"
                    ],
                    "correctIndex": 0,
                    "explanation": "Addressing Who, What, When, Where, Why, and How ensures complete incident and post-mortem reporting."
                },
                {
                    "id": 12,
                    "question": "What is a Post-Mortem (Root Cause Analysis / Retrospective) document?",
                    "options": [
                        "A blameless analysis of a production outage detailing timeline, root cause, impact, resolution, and preventive action items.",
                        "A disciplinary document used to terminate employees.",
                        "A financial invoice sent to cloud vendors.",
                        "A software manual written before coding."
                    ],
                    "correctIndex": 0,
                    "explanation": "Blameless post-mortems treat outages as learning opportunities to harden systems rather than punishing individuals."
                },
                {
                    "id": 13,
                    "question": "What tone is considered appropriate for professional technical documentation?",
                    "options": [
                        "Objective, concise, accurate, and professional without slang, emotional outbursts, or unnecessary jargon.",
                        "Emotional, dramatic, and humorous.",
                        "Extremely sarcastic.",
                        "Poetic with rhyming sentences."
                    ],
                    "correctIndex": 0,
                    "explanation": "Technical documents demand objective clarity, precision, and a calm professional demeanor."
                },
                {
                    "id": 14,
                    "question": "When sending an email attachment, why is it best practice to reference the attachment explicitly in the body text?",
                    "options": [
                        "It alerts the recipient that a file is included and prevents senders from forgetting to attach the file.",
                        "It speeds up email transmission over the wire.",
                        "It automatically scans the file for viruses.",
                        "It converts the file to PDF format."
                    ],
                    "correctIndex": 0,
                    "explanation": "Mentioning attachments provides context on what the file contains and prompts modern email clients to warn if you forget to attach it."
                },
                {
                    "id": 15,
                    "question": "What is 'Asynchronous Communication' in distributed and remote teams?",
                    "options": [
                        "Communication that does not require an immediate real-time response, allowing individuals to process messages at their own pace (e.g. emails, Jira, docs).",
                        "Talking through walkie-talkies simultaneously.",
                        "Speaking two languages in the same sentence.",
                        "A phone call with 20 people talking at once."
                    ],
                    "correctIndex": 0,
                    "explanation": "Async communication respects focus time across time zones by eliminating the expectation of instant replies."
                },
                {
                    "id": 16,
                    "question": "What is the 'Pyramid Principle' of communication developed by Barbara Minto?",
                    "options": [
                        "Start with the core answer/conclusion, group supporting arguments logically underneath, and support each with data.",
                        "Build up to the conclusion at the very end like a suspense novel.",
                        "Draw pyramids on slide backgrounds.",
                        "Send messages in batches of three."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Minto Pyramid Principle states that thinking is presented most effectively when ideas are grouped top-down starting with the conclusion."
                },
                {
                    "id": 17,
                    "question": "What is the purpose of a 'Call to Action' (CTA) in a business proposal or email?",
                    "options": [
                        "A clear statement specifying the exact next step, decision, or input required from the recipient.",
                        "A button that makes the user's phone ring.",
                        "A legal disclaimer at the bottom of the email.",
                        "A link to the company's social media page."
                    ],
                    "correctIndex": 0,
                    "explanation": "A CTA clarifies what you need the reader to do next (e.g., 'Please approve by Thursday 5 PM')."
                },
                {
                    "id": 18,
                    "question": "What is Stakeholder Management?",
                    "options": [
                        "The systematic identification, analysis, planning, and communication with individuals who have an interest in or are impacted by project outcomes.",
                        "Buying shares of stock in rival companies.",
                        "Managing office catering supplies.",
                        "Hosting annual shareholder dinners."
                    ],
                    "correctIndex": 0,
                    "explanation": "Stakeholder management maintains transparent communication and aligns expectations across technical and business leaders."
                },
                {
                    "id": 19,
                    "question": "How should critical feedback or constructive criticism be delivered to a colleague?",
                    "options": [
                        "Privately, focusing on specific behaviors and objective work outcomes rather than personal attributes, accompanied by actionable suggestions.",
                        "Publicly on general company channels to set an example.",
                        "Through anonymous passive-aggressive messages.",
                        "By copying their executive leadership on a complaint email."
                    ],
                    "correctIndex": 0,
                    "explanation": "Constructive feedback must be private, specific, empathetic, and focused on behaviors and forward-looking growth."
                },
                {
                    "id": 20,
                    "question": "What is the 'TL;DR' acronym commonly used in technical documentation and slack channels?",
                    "options": [
                        "Too Long; Didn't Read — a concise 1-2 sentence summary preceding a lengthy document.",
                        "Total Loss; Data Recovered.",
                        "Top Level; Domain Registration.",
                        "Technical Language; Database Routing."
                    ],
                    "correctIndex": 0,
                    "explanation": "TL;DR provides a quick executive summary for readers who need immediate context before diving into full details."
                }
            ]
        },

        # 19. Basic accounting (debit/credit, GST basics)
        {
            "id": "basic-accounting",
            "name": "Basic accounting (debit/credit, GST basics)",
            "displayName": "Business Accounting Fundamentals & GST Compliance",
            "category": "Finance & Business Operations",
            "description": "Double-entry bookkeeping, Golden rules, Assets=Liabilities+Equity, P&L vs Balance Sheet, and GST fundamentals.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "What is the foundational Accounting Equation in double-entry bookkeeping?",
                    "options": [
                        "Assets = Liabilities + Equity (Capital)",
                        "Assets = Liabilities - Revenue",
                        "Profit = Cash + Expenses",
                        "Equity = Assets + Liabilities"
                    ],
                    "correctIndex": 0,
                    "explanation": "Assets (what the company owns) must always balance with the sum of Liabilities (what it owes) and Equity (owner's claim)."
                },
                {
                    "id": 2,
                    "question": "In traditional Golden Rules of Accounting, what is the rule for Real Accounts (assets, cash, property)?",
                    "options": [
                        "Debit what comes in, Credit what goes out.",
                        "Debit the receiver, Credit the giver.",
                        "Debit all expenses, Credit all incomes.",
                        "Debit equity, Credit revenue."
                    ],
                    "correctIndex": 0,
                    "explanation": "Real Accounts: Debit what comes into the business; Credit what leaves the business."
                },
                {
                    "id": 3,
                    "question": "In the Golden Rules of Accounting, what is the rule for Nominal Accounts (expenses, losses, incomes, gains)?",
                    "options": [
                        "Debit all expenses and losses, Credit all incomes and gains.",
                        "Debit what comes in, Credit what goes out.",
                        "Debit assets, Credit liabilities.",
                        "Debit the giver, Credit the receiver."
                    ],
                    "correctIndex": 0,
                    "explanation": "Nominal accounts track revenue and expense lifecycles: Debit all expenses/losses; Credit all incomes/gains."
                },
                {
                    "id": 4,
                    "question": "In Double-Entry Bookkeeping, what must always be true for every recorded transaction?",
                    "options": [
                        "Total Debit amounts must exactly equal total Credit amounts.",
                        "Debits must exceed credits by 10%.",
                        "Credits must always be zero on Sundays.",
                        "Transactions are recorded only once a year."
                    ],
                    "correctIndex": 0,
                    "explanation": "Double-entry bookkeeping requires that every financial transaction has equal and opposite debits and credits."
                },
                {
                    "id": 5,
                    "question": "What is the primary difference between a Balance Sheet and a Profit & Loss (P&L) Statement?",
                    "options": [
                        "A Balance Sheet captures financial position (Assets, Liabilities, Equity) at a single specific point in time; a P&L records financial performance (Revenues and Expenses) over a period.",
                        "A Balance Sheet only records bank accounts.",
                        "A P&L is only used by non-profit charities.",
                        "They are exact synonyms."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Balance Sheet is a snapshot of financial health on a specific date; the P&L measures operational earnings over a period (e.g. quarter, fiscal year)."
                },
                {
                    "id": 6,
                    "question": "What is the difference between Cash Basis and Accrual Basis accounting?",
                    "options": [
                        "Cash basis records transactions only when cash physically enters or exits the bank; Accrual basis records revenues when earned and expenses when incurred regardless of cash timing.",
                        "Cash basis is only for paper currency.",
                        "Accrual basis cannot be used by registered corporations.",
                        "Cash basis is mandatory under IFRS international standards."
                    ],
                    "correctIndex": 0,
                    "explanation": "Accrual accounting matches expenses with related revenues in the period incurred, reflecting genuine economic activity."
                },
                {
                    "id": 7,
                    "question": "What does GST stand for in modern indirect taxation systems?",
                    "options": ["Goods and Services Tax", "General Sales Tax", "Government Standard Tariff", "Global Shipping Transaction"],
                    "correctIndex": 0,
                    "explanation": "GST is a comprehensive destination-based indirect tax levied on the manufacture, sale, and consumption of goods and services."
                },
                {
                    "id": 8,
                    "question": "In India's GST dual model, what are the three main components of GST on transactions?",
                    "options": [
                        "CGST (Central GST), SGST (State GST) for intra-state sales; IGST (Integrated GST) for inter-state sales.",
                        "VAT, Excise, Service Tax",
                        "Income Tax, Corporate Tax, Wealth Tax",
                        "Import Duty, Export Tax, Stamp Duty"
                    ],
                    "correctIndex": 0,
                    "explanation": "Intra-state sales share revenue equally between CGST and SGST; inter-state supplies attract IGST collected by the Centre."
                },
                {
                    "id": 9,
                    "question": "What is Input Tax Credit (ITC) under GST?",
                    "options": [
                        "The mechanism allowing businesses to deduct the GST tax paid on business purchases (inputs) from the GST collected on their sales (outputs).",
                        "A bank loan offered by the government.",
                        "A cash refund given to individual retail consumers.",
                        "A discount on credit cards."
                    ],
                    "correctIndex": 0,
                    "explanation": "ITC prevents the cascading 'tax-on-tax' effect by offsetting taxes paid on supply inputs against output tax obligations."
                },
                {
                    "id": 10,
                    "question": "When a company buys a server for $5,000 cash, which accounts are debited and credited?",
                    "options": [
                        "Debit Server (Asset increases); Credit Cash (Asset decreases).",
                        "Debit Cash; Credit Server.",
                        "Debit Revenue; Credit Bank.",
                        "Debit Equity; Credit Profit."
                    ],
                    "correctIndex": 0,
                    "explanation": "The asset Server increases (Debit what comes in); the asset Cash decreases (Credit what goes out)."
                },
                {
                    "id": 11,
                    "question": "What is Depreciation in business accounting?",
                    "options": [
                        "The systematic allocation of the cost of a tangible fixed asset over its useful economic lifespan.",
                        "The loss of cash due to bank theft.",
                        "The decrease in company share price.",
                        "An error in the spreadsheet calculation."
                    ],
                    "correctIndex": 0,
                    "explanation": "Depreciation spreads the expense of physical assets (machinery, laptops, servers) across the multi-year periods they generate revenue."
                },
                {
                    "id": 12,
                    "question": "What are Accounts Receivable (AR)?",
                    "options": [
                        "Money owed to a company by its customers for goods or services delivered on credit terms.",
                        "Money the company owes to external suppliers.",
                        "Taxes due to the government.",
                        "Employee salaries."
                    ],
                    "correctIndex": 0,
                    "explanation": "Accounts Receivable represents money legally owed to the company by debtors, classified as a Current Asset."
                },
                {
                    "id": 13,
                    "question": "What are Accounts Payable (AP)?",
                    "options": [
                        "Short-term obligations the company owes to suppliers and vendors for goods or services received on credit.",
                        "Money received from clients in advance.",
                        "Company share capital.",
                        "Office equipment."
                    ],
                    "correctIndex": 0,
                    "explanation": "Accounts Payable represents short-term liabilities owed to creditors for purchases made on credit."
                },
                {
                    "id": 14,
                    "question": "What is Working Capital?",
                    "options": [
                        "Current Assets minus Current Liabilities (measures short-term liquidity and operational health).",
                        "Total company revenue.",
                        "The money spent on building a new factory.",
                        "The value of company stock."
                    ],
                    "correctIndex": 0,
                    "explanation": "Working Capital (Current Assets - Current Liabilities) evaluates whether a business can meet its immediate debt obligations."
                },
                {
                    "id": 15,
                    "question": "What is Gross Profit vs Net Profit?",
                    "options": [
                        "Gross Profit is Revenue minus Cost of Goods Sold (COGS); Net Profit is the final profit after deducting all operating expenses, interest, and taxes.",
                        "Gross profit is after taxes; Net profit is before taxes.",
                        "Gross profit only includes cash sales.",
                        "They are identical values."
                    ],
                    "correctIndex": 0,
                    "explanation": "Gross profit reflects direct production margin; Net profit (the 'bottom line') reflects total company profitability after all operating expenses."
                },
                {
                    "id": 16,
                    "question": "What is a General Ledger (GL)?",
                    "options": [
                        "The master set of accounts that summarizes all financial transactions recorded across the business.",
                        "A list of company employees.",
                        "An address book of customers.",
                        "A software manual for accounting tools."
                    ],
                    "correctIndex": 0,
                    "explanation": "The General Ledger is the central record-keeping system containing debit and credit transactions categorized by account chart."
                },
                {
                    "id": 17,
                    "question": "What is a Trial Balance?",
                    "options": [
                        "A bookkeeping worksheet where the balances of all ledgers are compiled into debit and credit columns to verify mathematical equality.",
                        "A trial period where software is free for 30 days.",
                        "A bank statement showing interest.",
                        "An audit conducted by police."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Trial Balance verifies arithmetic accuracy; if total debits equal total credits, the basic math of the books is sound."
                },
                {
                    "id": 18,
                    "question": "What is an Invoice in commercial transactions?",
                    "options": [
                        "A time-stamped commercial document issued by a seller to a buyer detailing products, quantities, agreed prices, and payment terms.",
                        "A receipt given after payment has already cleared.",
                        "A marketing brochure.",
                        "A legal contract for hiring employees."
                    ],
                    "correctIndex": 0,
                    "explanation": "An invoice requests payment for supplied items, documenting tax compliance (GSTIN, HSN codes) and payment schedules."
                },
                {
                    "id": 19,
                    "question": "What does HSN code stand for under GST invoices?",
                    "options": [
                        "Harmonized System of Nomenclature — a standardized numerical code for classifying goods worldwide.",
                        "High Security Number",
                        "Home State Network",
                        "Hourly Salary Number"
                    ],
                    "correctIndex": 0,
                    "explanation": "HSN is a multi-purpose international naming system developed by the World Customs Organization (WCO) to classify goods for tax rates."
                },
                {
                    "id": 20,
                    "question": "What is the purpose of an E-Way Bill in GST compliance for goods transportation?",
                    "options": [
                        "An electronic document generated on the GST portal evidencing the legal movement of goods worth over a threshold (e.g. ₹50,000).",
                        "A train ticket for truck drivers.",
                        "An online highway toll payment receipt.",
                        "An import visa for goods."
                    ],
                    "correctIndex": 0,
                    "explanation": "E-Way bills are mandatory digital permits tracking consignment movement to prevent tax evasion across state borders."
                }
            ]
        },

        # 20. Project management basics (Agile, Scrum)
        {
            "id": "project-management",
            "name": "Project management basics (Agile, Scrum)",
            "displayName": "Agile Methodologies, Scrum Framework & Project Governance",
            "category": "Project Management & Leadership",
            "description": "Agile Manifesto values, Scrum roles, ceremonies, artifacts, Kanban WIP limits, and sprint metrics.",
            "estimated_minutes": 20,
            "questions": [
                {
                    "id": 1,
                    "question": "Which of the following is one of the four foundational core values of the Agile Manifesto?",
                    "options": [
                        "Individuals and interactions over processes and tools",
                        "Comprehensive documentation over working software",
                        "Contract negotiation over customer collaboration",
                        "Following a rigid plan over responding to change"
                    ],
                    "correctIndex": 0,
                    "explanation": "The Agile Manifesto values: Individuals & interactions over processes; Working software over documentation; Customer collaboration over contracts; Responding to change over plans."
                },
                {
                    "id": 2,
                    "question": "In the Scrum framework, what are the three distinct defined roles?",
                    "options": [
                        "Product Owner, Scrum Master, Developers (Development Team)",
                        "Project Manager, Technical Lead, QA Engineer",
                        "CEO, CTO, Lead Architect",
                        "Business Analyst, Software Developer, System Administrator"
                    ],
                    "correctIndex": 0,
                    "explanation": "Scrum defines exactly 3 roles: Product Owner (maximizes product value), Scrum Master (coaches process), Developers (build the increment)."
                },
                {
                    "id": 3,
                    "question": "What is the primary responsibility of the Product Owner in Scrum?",
                    "options": [
                        "Managing and prioritizing the Product Backlog to maximize the value delivered by the team.",
                        "Assigning daily coding tasks to developers.",
                        "Facilitating daily standup meetings.",
                        "Writing all automated unit tests."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Product Owner owns the vision, prioritizes features, and ensures the Product Backlog reflects stakeholder value."
                },
                {
                    "id": 4,
                    "question": "What is the typical timeboxed duration of a Daily Scrum (Daily Standup) meeting?",
                    "options": ["15 minutes", "1 hour", "45 minutes", "5 minutes"],
                    "correctIndex": 0,
                    "explanation": "The Daily Scrum is strictly timeboxed to 15 minutes to inspect progress toward the Sprint Goal and adapt the daily plan."
                },
                {
                    "id": 5,
                    "question": "What are the three questions developers traditionally address during a Daily Standup?",
                    "options": [
                        "What did I do yesterday? What will I do today? Are there any blockers/impediments in my way?",
                        "How much budget is left? Who is to blame? Can we go home early?",
                        "What code did I delete? What bugs did I write? What is the weather?",
                        "What is our stock price? Who wrote this bug? When is lunch?"
                    ],
                    "correctIndex": 0,
                    "explanation": "The classic standup format inspects yesterday's progress, today's commitments, and any impediments obstructing the team."
                },
                {
                    "id": 6,
                    "question": "What is the primary objective of the Sprint Retrospective meeting?",
                    "options": [
                        "For the Scrum Team to inspect how the last Sprint went regarding individuals, interactions, processes, and tools, and identify actionable improvements.",
                        "Demonstrating working software to external clients.",
                        "Estimating story points for the next 6 months.",
                        "Assigning performance bonuses to developers."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Sprint Retrospective focuses on continuous team improvement: what went well, what went wrong, and how to improve next sprint."
                },
                {
                    "id": 7,
                    "question": "What is the Definition of Done (DoD) in Scrum?",
                    "options": [
                        "A formal shared checklist of quality criteria that a product increment must satisfy before it can be considered complete and releasable.",
                        "When a developer finishes typing code on their local laptop.",
                        "When the Product Owner leaves the office for the day.",
                        "When the sprint deadline clock reaches midnight."
                    ],
                    "correctIndex": 0,
                    "explanation": "The DoD ensures transparency by establishing a shared standard of quality (e.g. tested, reviewed, documented, passing CI/CD)."
                },
                {
                    "id": 8,
                    "question": "What is a Sprint Burndown Chart used for?",
                    "options": [
                        "Showing the remaining work (story points or hours) across the days of the Sprint to track progress toward the Sprint Goal.",
                        "Calculating the financial burn rate of company bank accounts.",
                        "Measuring CPU heat on the build server.",
                        "Recording lines of code deleted."
                    ],
                    "correctIndex": 0,
                    "explanation": "A burndown chart visualizes remaining sprint backlog work over time, highlighting whether the team is on track to complete commitments."
                },
                {
                    "id": 9,
                    "question": "In Kanban, what is the primary purpose of a 'Work In Progress' (WIP) Limit?",
                    "options": [
                        "Restricting the maximum number of task cards allowed in any workflow state to prevent bottlenecks and improve flow throughput.",
                        "Limiting how many hours a developer can work per week.",
                        "Limiting the number of lines of code in a file.",
                        "Preventing new employees from joining the project."
                    ],
                    "correctIndex": 0,
                    "explanation": "WIP limits prevent multitasking and context-switching, forcing teams to complete existing work before starting new items."
                },
                {
                    "id": 10,
                    "question": "What is a User Story typically composed of in Agile requirements management?",
                    "options": [
                        "A short template: 'As a <type of user>, I want <goal/feature>, so that <business value/benefit>'.",
                        "A 50-page technical specification document.",
                        "A database schema diagram.",
                        "A financial balance sheet."
                    ],
                    "correctIndex": 0,
                    "explanation": "User stories capture software requirements from the end-user's perspective, emphasizing business value."
                },
                {
                    "id": 11,
                    "question": "What are Story Points in Agile estimation?",
                    "options": [
                        "A relative unit of measure assessing the overall effort, complexity, and uncertainty of a user story rather than raw calendar hours.",
                        "Loyalty points earned by developers.",
                        "The number of words in a user story.",
                        "The hourly billing rate charged to clients."
                    ],
                    "correctIndex": 0,
                    "explanation": "Story points evaluate relative size and complexity (often using modified Fibonacci: 1, 2, 3, 5, 8, 13) independent of specific hourly estimations."
                },
                {
                    "id": 12,
                    "question": "What is Team Velocity in Scrum?",
                    "options": [
                        "The average amount of Product Backlog work (in story points) completed and verified as 'Done' by the team during a typical Sprint.",
                        "The internet upload speed of the office Wi-Fi.",
                        "The typing speed of developers in words per minute.",
                        "The speed of server deployment pipelines."
                    ],
                    "correctIndex": 0,
                    "explanation": "Velocity measures the pace of delivery across sprints, helping the team forecast realistic capacity for future sprint planning."
                },
                {
                    "id": 13,
                    "question": "What is the Sprint Backlog?",
                    "options": [
                        "The set of Product Backlog items selected for the Sprint, along with the plan for delivering the product Increment.",
                        "All ideas the company will build over the next 5 years.",
                        "A list of bugs that cannot be fixed.",
                        "An archive of deleted files."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Sprint Backlog is owned by the developers and represents the specific items committed to achieving the Sprint Goal."
                },
                {
                    "id": 14,
                    "question": "What is the primary role of the Scrum Master?",
                    "options": [
                        "A servant-leader who coaches the team on Scrum principles, facilitates events, and removes organizational impediments.",
                        "The authoritarian boss who assigns tasks to developers.",
                        "The lead programmer who writes the most code.",
                        "The client representative paying the bills."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Scrum Master is a servant leader focused on team effectiveness, removing blockers, and fostering high-performance agile culture."
                },
                {
                    "id": 15,
                    "question": "What occurs during the Sprint Review meeting?",
                    "options": [
                        "The Scrum Team presents the completed working Increment to stakeholders and discusses what to build next.",
                        "The team conducts code refactoring in private.",
                        "The manager reviews developer attendance.",
                        "The team plans the next sprint's detailed tasks."
                    ],
                    "correctIndex": 0,
                    "explanation": "The Sprint Review is a collaborative session where the team demonstrates the completed increment to stakeholders to gather feedback."
                },
                {
                    "id": 16,
                    "question": "What is the INVEST mnemonic used for in Agile requirements?",
                    "options": [
                        "Criteria for quality user stories: Independent, Negotiable, Valuable, Estimable, Small, Testable.",
                        "A guide on how to invest venture capital money.",
                        "A formula for calculating interest on bank loans.",
                        "An acronym for corporate budgeting."
                    ],
                    "correctIndex": 0,
                    "explanation": "Bill Wake's INVEST criteria ensures stories are ready for sprint execution: Independent, Negotiable, Valuable, Estimable, Small, Testable."
                },
                {
                    "id": 17,
                    "question": "What is a 'Spike' in Agile terminology?",
                    "options": [
                        "A timeboxed research or exploratory task aimed at gathering information or resolving technical uncertainty before estimating a feature.",
                        "A sudden crash in server memory.",
                        "A sharp increase in company sales.",
                        "An argument during a meeting."
                    ],
                    "correctIndex": 0,
                    "explanation": "A spike is a timeboxed investigation used when the team needs to explore architecture, test a library, or reduce risk before committing."
                },
                {
                    "id": 18,
                    "question": "What is the difference between Scrum and Waterfall project management?",
                    "options": [
                        "Waterfall is linear, sequential, and phase-based with heavy upfront planning; Scrum is iterative, incremental, and adapts to changing requirements.",
                        "Waterfall only uses computers; Scrum uses paper cards.",
                        "Scrum has no testing phase.",
                        "Waterfall has no project managers."
                    ],
                    "correctIndex": 0,
                    "explanation": "Waterfall flows sequentially from requirements to design to implementation to testing; Scrum delivers working increments iteratively."
                },
                {
                    "id": 19,
                    "question": "What is 'Scope Creep'?",
                    "options": [
                        "The uncontrolled expansion of project scope without adjustments to time, cost, or resources.",
                        "A developer working on code at midnight.",
                        "Zooming in on a user interface screen.",
                        "A bug moving from one file to another."
                    ],
                    "correctIndex": 0,
                    "explanation": "Scope creep happens when new features and requirements are continuously added without adjusting project deadlines or budgets."
                },
                {
                    "id": 20,
                    "question": "What is a Gantt Chart primarily used for in traditional project management?",
                    "options": [
                        "Illustrating a project schedule, displaying task dependencies, start and finish dates, and milestones along a visual timeline.",
                        "Calculating company tax liabilities.",
                        "Listing database tables.",
                        "Evaluating developer typing speeds."
                    ],
                    "correctIndex": 0,
                    "explanation": "A Gantt chart illustrates project activities as horizontal bars plotted against a timeline, showing task sequences and dependencies."
                }
            ]
        }
    ]
