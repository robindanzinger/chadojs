var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var report = require('../lib/report');
buster.testCase("library report", {
  "given an assumption map with verifications" : {
    setUp : function () {
      this.assumptions = {
        "lib" : {
          "func" : {
            "arg" : {
              "returnValue" : {
                "assume" : {
                 "file" : {
                    "5" : {
                    }
                  }
                },
                "verify" : {
                  "anyfile" : {
                    "7" : {
                    }
                  }
                }
              }
            }
          },
          "anotherfunc" : {
            undefined : {
              "return" : {
                "assume" : {
                  "file" : {
                    "1" : {
                    }
                  }
                },
                "verify" : {
                  "anotherfile" : {
                    "1" : {
                    }
                  }
                }
              }
            }
          }
        },
         "anotherlib" : {
          "func" : {
            "arg" : {
              "returnValue" : {
                "assume" : {
                  "file" : {
                    "10" : {
                    }
                  }
                }
              }
            }
          }
        }
      };
    },
    "function getVerifiedAssumptions returns all assumptions with at least one verification" : function () {
      var assumption = report.getVerifiedAssumptions(this.assumptions)[0];
      assert.equals("lib", assumption.lib);
      assert.equals("func", assumption.func);
      assert.equals("arg", assumption.args);
      assert.equals("returnValue", assumption.returnValue);
      assert.equals(report.getVerifiedAssumptions(this.assumptions).length, 2);
    },
    "function getNotVerifiedAssumptions returns all assumptions with no verification" : function () {
      var assumption = report.getNotVerifiedAssumptions(this.assumptions)[0];
      assert.equals("anotherlib", assumption.lib);
      assert.equals("func", assumption.func);
      assert.equals("arg", assumption.args);
      assert.equals("returnValue", assumption.returnValue);
      assert.equals(report.getNotVerifiedAssumptions(this.assumptions).length, 1);
    }
  }
});
