const { WidthType, AlignmentType,
    TableBorders,
    BorderStyle,
    ImageRun,
    Table,
    TableRow,
    TableCell,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun } = require("docx");
const imageBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAlgAAABNCAYAAAB64hrdAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAILFJREFUeJztnQ+QFNWdxx+4oZAjgBgtghxpcS9YHsJepCIaTE04LgGP8oAzHsVZXlekkEoRzlI0hBPS8YhF1CjRBBNRmBQaJIQYQzxOEXcBEQ0hiEYR0Wz4l00gsKwENoDk3XxnpofeX/+6+3X3zOys9/tU/UrZeX9+3f36vW+/9+vXSgmCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAjJachZa850paxHjx56wIAB+pJLLtEjRozQDQ0NJRs+fLgeMmSIvvDCC3VdXV3FfChac86scp9AQRAEQRAEStkFFsTUVVddpWfOnKl/8IMf6M2bN+udO3fqvXv36iNHjujW1taSHT58WO/Zs0e/+eaburGxUT/++ON6+vTpevTo0bp///4isARBEARB6JKUTWBdfPHFev78+XkxdeLECZ2G9vZ2vWPHDj1v3ry8YCuHf0oEliAIgiAIVSK1wMpkMnrJkiX62LFjqURVEJjlwswWlhTT+KlEYAmCIAiCUCUSCazu3bvrUaNG6XXr1lVEVAWxYsWK/PJhXH+VCCxBEARBEKpIbIHVp08fPWvWLL1r166qiitw5swZ/dZbb+mbbrpJ9+vXTwSWIAiCIAg1SSyBhVmrDRs26FOnTlVdXHlBjBaC4i+99FIRWIIgCIIg1BzGAgtiBgHstcSWLVt0fX29CCxBEARBEGqKSIGFeCssCba0tHS2nmJBEPwNN9wgAksQBEEQhJohUmB98YtfTL3tQqWByBo/frwILEEQBEEQaoJQgTV16lS9e/fuztZPRhw8eFCPGTNGBJYgCIIgCJ1OoMBCbFNbW1tn66ZY7Nu3L2wHeBFYgiAIgiBUBVZg4fuBYXtc4dM2999/v37jjTeqKJ/MWLZsWf7bhvSYlAgsQRAEQRCqhE9g9ezZM79zehDYsR3bNSAt9qKqRR566KF8cL4SgSUIgiAIQifgE1j49A0+xBwEfvN+tqYWwYelL7/8chFYgiAIgiB0Ch0EVu/evfXatWtDxUtcgXX81Ad5++tfyyWfzMAsHI5HicASBEEQBKHKdBBYmL2K+mizqcCCqFr9+kE986dv5+3JbX/Q7afPlFtHBYJ9uyZOnCgCSxAEQRCEqlMSWHV1dUZbMpgIrK372vTw+17R6rYXOtj12dd1y/sny62lAtm6dasILEGIprcq3Bte+1gFy+5dprKFcHANLWI9O82b9HDHU9dp3oTTPWcDVUdf8e9a9ffDxgDlbytVpySwJkyYYCRaogTWq3vb9LlffdEnrlyb8Nhr+kwVlwuHDRtWLYE1I2fbiQ1k0t3NpPNag0FdtIxnye+zI+owtZGeMj+as6cSlLEpZw/k7PMqfGBN6/NQUt7AhP6uV4VreWmIr/Rab2TqB99IUP+rOftRzqbkbJAqf4eMAXZszrI5e1tFfwHh9ZzdWfQlCgwqo3K2IGdvRpR7UhWOFW0Z57pHSLm4lmHn7BYD34Yq/zW7jvy+MaIeE1tC6r0uYTloA9Ny9kmDYwP9cvaPqtDm96jwc39YFdr5jTn7eM66hZTL9WvVAO3Bbae/VeHHcyxnz6jC+bqQKWu18h/DZ1X4cbtckbOXSV70t7Rv71/0d1XO9kf421JMh3v8o0ydUe3d1B4j5SZti65dR8qLGhNo+jDOydn9IWU9pfhzBXoV6/qJKpzbsHN/sFjWhJz1ieFfIkoCa/ny5UaCJUxgvfenE9pa8FJJTPW/a4Oe/fPd+oYfvlESXXWz1+t17xyuhJZiWbBgQbUElqP8F5OrL8uk89oyg7poGc3k9wcj6jC1jKdMdODbU5SFAXVdzr6g+I4trc9UmFop/D2jCjfqLFW48SkOSd/K1A+WpTym3Tm7J2fnMWUn4dOq0LG3J/BlZ84uU8GDEgaYxTlry9lfY5aNc70o5DitiPxHVbggBg0kD66ZTX5vjek3Z42kXjtleQdUoR2GtQH4vkUVhEbcdg4BjYGea+fAYfJVGojKpSpZO92mCm3B205vYtLhOv1dhB8YgH+k/OcMDwXdib/rE/iLPrFJ+duuleC4OWsi5dopy7NJeVFjwmplTn3O9oWUtb1YHwUPdBDXp2MeyweqIJT7x/AxNqVOBZ+bMSFIYO0/+hc9cemODuJqzZuH8r+1tZ/Wk5ad/W3M4m0VEVMc27Ztc31tVl1DYOEmHRBRFy2jmfxeiwLLNcxscLMhtSSwXEMH+K+Mrw5JVymB5XYE9zNlx2Vwznak9GWN4q9d35z9rAzHeU+A75ZB/kURx99VBZbbDv8z4Lguytl7KcvHjNZVAeU7TPpKAqFHRU1cw0zGxz1lYha4iUl3X4QvELZUtL6bs0940vQok79erJTludZEyrVTlmeT8qLGBIxlpgLmZhX+YMYJLKyINKY8pvkqfPY8FflOZfTo0caChRNYWPK7c83ukoDqcceLeumrBzrk2/K7Nt3vv5pKadbvPlJWIRXGZZddBl+bVdcQWLpYVlisBC2jmfxeywILNo05JuozBpV9xWMzsctIeRbjb1tA3kMhvkIQ0mUHh6SppMBy/Z7JlB+HhSHloyP0no+wJ8kbmbK/pApP9lz6VuU/30FP+pjJmsiUb4X4462He8J16coCC4aZGbqkgT7i6ZA8mP2i1/VkQNrdiu9zHCZtJRmi+CVOiMBfqELf57WtTFrMZtDlKVzfP5J0OB/1AX70Vvx9cD1JNzbAX+T9KfH1qRB/vW3XYtIksSbiqx3gJ70/g4weu8mYsEBFAwEc1o614gXW1Tk7TtKdKfqKB76sx55QhVl47vg/ZeBjIhrq6upaHccxFiucwNrwXqvuM7epJJ7+e12zPk0CrfDPqU/8ppTm04t+qVtPnE4kmDAjtvOPx311BPHggw9qVbsCCxedPiVhAKKNOayMZvJ7f+UP8HON+rgoJK23w+VupmUhPiI9RM8jyj/4rmDSU4G1XaW7Xhbj74MReTDdvIHkQeeXIekcksZUYEGsDVfB5xud/fWMD25HkBQsQbxBykPHNFcFz5ZigEEMGR2QHyHp0EY2kTTIg2WUsLgtDKTPKP9xrmHSWkw6rrN0VPCDSZTAwlPsYMVfl0VMXVw6GD2fNlNvWJwlypiqCvd0VD4s+dIBBvkQNxV0HjCYXav4gZ7rcxwmXSUZo/z9BZaew2YZMqogwGhboCxQ/mN5VPFxjlxaGtOkivVQf6NmRWYwZWc8v8MfK8BoW0S/MDogbVRbDBqjTOHGBPqwitnVwRHlYJzgxC8dD6jAmknS4Doglre7CubLyt+nTYk60KQ0DBgwoHX16tXG4oYKLGy9MP3HO0vC6VMPvKqPtvPCaeVrf9S9v9aYT/fR3H83vhe8oWkQ7//lAz1t5Vt62L2vaOe594zybNy4Uffq1Qsdj1WpE6mSC6wmVehA6PToShV8k9IymmP4yQ1KJsQVWC5/r/xBn+uZdLUgsMCXlP8cTSVpHPK7qcAKiiPwgtgRiI/dJO8Zlfx8TM7ZH0h5a1Vw0KjLIMaPp0kadJ50ieqVnF1g4BcCjamQOMCks5T/mtzN/A2ia1RAXVECKwyHqcsUm6k36kUWN+DXmw9LqNeQdDeSNOhD7lLRSx4o/zrlPyZuidZh0lWSqaQuPOB8PiIP4tNeI/nogwDAw81eku53qiA4vUCY0FkpPPRyMx2PMun6Rvg7RPnPqekg75B8ccY1m6nXNC8HNyb8XBXaqvtviJkJEeVgKdYrUvHQ8GNSLtd3zidpEMB+eURdiLuj45EdkScxDVdccUVrc3OzscChAuvhl/aVlv4QwB629Hf4+Cn9pafeKomxGat2xnqjEGm/s3Gv/sgd6/P5L/vWFqN8OL76+vo4DTEJjjJrvFmSBk//CJKkNz6WhT4bUBctozmGn9RHxzBfUoGFJ+ktJB+enunTVa0ILLw5SWcU55A0Dvm9nALL5U7lv1bc8pkJ8J8GgdoG+TAQbyT5GkmaETk7QtLMN/QLb/98V/mPk24RYTFpMNPBzYAFPZh0JYEFpjB1ZkgaOsDgOoww9KtO+ZdEf8akcxg/Komt4p8vPJRgdsn71tk3mHSY2fgP5b8XMLvrzvhh5nY1+R2iKSjGL0vSmvTF3Ymvcd64c5j6LMO8tvJfS9O8HNyY8C1ViFPz/g1Lo0EvUaAM+uYfHuJo2+b6TkfFPxd4Q/NZlfxtx1g0jBkzpvX0afOlOiqwGr79akkwjXzwl5H5Efjupscs1KE/nzKuG8uC3vowk2UCAvhHjhwZpyEmwVFmjTdL0uCpO2gNupw3tQutwzHMl1RggUblv1kskqZWBBYXi+OQNA75vRICa4LyXyvbMC+F+gv7tGFeeu0aye+Ig6BT7nH8nM34ZpE0FpMmowrxLzSeC50190ZhVxNYGabODEnzMPk9bh9Hl42bmDQO40clsUlduL5Bs5Je6L5HYfu4ccujmeJvWG6jD1jYTiQoViur/NfXBIuY6d5wjkp+zW3lP27TvBzcmICl1bXkb7sUv2URGMf4dKtKJrDCYupcMNZiZt5S8c99bBqmT58ea52OCixX7GB7hsZ3owPXETc16O5NpRmvJ3/dYlQv8o36ztZSfR+btyFWDNf48ePjdj5xcZRZ480q/w0C0NDoYIF1aW7qOKgME6iPjmG+cgosOkgDEVh+P+i1mm2Yl8LFEJkM8iZkmLLHxchvM/lNXlvHfYFZB9q2YNyDSVcTWGOZOjMkDW1fEExxNohtIvm3MGkcxo9Kwj1Y4AWNcu4HN4qpY1OxjlXk7+0qfImLLuXCvlxmf704pK4445qt/L6a5uXgxgT4N438Dct/MwLKeIrxaZDyHyfXd9KHM9QzPcXxlJ2Gu+++uywCa9bTu4zLmP3zd0r56u952ShY/dEt+0t5EFD/vc374ritb7nlljgNMQmOMmu8WeW/QQAC07knK7w9RIP2gsowgZbvGOZLKrAQj/Brku85Jh0VWNgEE7ERDQbGBVFajL8mAgsbC75P8t1F0jjk90oILEslv1aULFNWJQVWJkZ+2yC/xaSxi79xbzA2M2V0NYFFByksa40madK0L9Ck/OeN4qjkx54E7gEHMT3Y7BNxd5jdgLjOqML5QHqEWGAGK46owTIRjXtF3BadvUK6sJg2O8BfxJl+rejvhKK/o4r+Ypblwpj+ujjKf80sw7y28l/LOH0sXeYLEliIg9pF/o5YTnq8CBGg5/uNgOPk2jZCJui9j9n051Whz8a5R/xpRhVm2nEcl6hCfGjQkmVZaVi4cGFqgQXBs+m35sVs2/e+Pmf2+pJgWrvzT6Hp3/zDn/VApzDr1e32gpjDtw7j8JWvfCVOQ0yCo/yNl6svq/w3iAvWgml8ABrQmBhlRJF00E4isBAbgd2l6Rs+32bSUoGFTgpxaK0Gtpgpz2L8jRJYELJ4AqIdr03SOeR3EVidJ7Cw9ECXunDPYGD0Pph0JYGF7Rh+SvIhMJdujPlhFFh9Gb+CDH0lzidejECoBWahMLCa7L0EsfMbUt4H5N8IdP+niHIGx/C3vegvlrLwRjEeNGcZ+uviKP81swzz2oxPcfpYGrwfJLB6Mn7CxnryYmy4nknjBBwn17Y/ofzxXkF2sngciHXGdf8fVXg46xV6xlJSFoF1zXd/pU+civch5zGPbCsJLOz0HsTBY6f0lYvOLg0O+eZm3Xy4PVZdoIsILNDIlEODT6PKCCPpoM3dTAgy5p52EN9jq8JSDX0bBw2deyuICqw4lmXKsxh/wwQWniod5X/DBJ3u50hah6QRgdXRMjHy2wb5LSaNHVEGRJb3ra9aEViYHf035b9nMHOKB6zbcvZSzk6RfP+bs4+QstO0L9BE8nP9iKOSH3tS/kX5H8riGILUo7YGALdFlIPf6TkP8vdESn9NcUheXDPLMK+dwses8retIIEFPsmU8agn7/mK36B1WMBxcm0bIg0CNWhvtyhDH4HPuFVsN/eyCKzvvhRvuQ7gbcNecwpbNvT86ovsR6Cxcjj32XdL4grpHnvlAFNaNF1IYHFBf3hS8wYlR5URBi3bMcxXjo1GMR2MeApuyr0aAiuJYWqb7ufkkDS1LrC4PX0+TAILcNc66/m9VgRWEluryt++QBPJz/UjDuNPpcHMI+LwsDlk1LflgizoBSEvWFaks5/ec2H6YWz4e23RX7pcaGqmbwg7jJ+WYV47oW/uvRRHYAEa8uLdyw9LdnTPLO/2PfQ4g9o2lh0xG4l7JO6nomAYW7/MlFsWGhYsWJBKYDXc/2r+7b64YP+scY9uL4mnW3+2Sx/7S8dlv4c27dU97zz74ehHXt6vT34Qb6bMpQsJLNDIlIXG6iptkzKCoOU6hvnSCiwE0GKQCNoEjgosTKEHbaBHjQvstVL66958NlO2Q9JVS2BxO+CbQP3VAf4mIcOUnYmR3zbIbzFpbJKGC47G9XOPsysKrJZi3UGxOmnaF2gi+bl+xGH8qjY4JksV+gMsM2GvLCzvIMgZD2yblT+0Ap+FMpmZwF5i3JcFkm6JAtAfYQbns0V/7aK/c4v+cqLuCUN/HeW/ZpahXzZTb5w+lvbdUQKL21DVjSOkD30QR1eHHKdp23bPfUYVJitwfRH2gaVjiG7uI/RrDcpNRENOeKQSWHN+8W7s5UGXJa8cyL9JCPE04Osb9TO/OVT6DR+EvmD+hpK4whuEbQEbmJowefLkOA0xCY7yXziuvqzy3yAUW/nVPTZfc9/OMikjCOqjY5gvrcCC/xCJtyh+wKjGW4RxDDf8vTk7lynbIWkrIbCGMT7Zhnmj/NUB/nIMUB2XsrDrsncGMsOUHbWxoBebyT+MpLGYNDZJg1gKbnf3pUV/u6LAwvI04ouwjMEtedH2xX3WKYwmkr8W3iKMC/oSxKZh9sPro8kO4qqYZh3Ji7CGSsXmwF9seEpDEV5QZv46JF+ccc1W/mtpmpcjSmChbLp8B5GJc/s8+TvK8T4oO8zvcR4eODAjeaXy9xMYlyqyVUPDpEmTYgmsw0da9fARI0rOIWA9KdgD63OLz8ZiDb/vFb25+Wh+ryxsw+D+fejClxPNkrkcP35cX3PNNXEaYhIcZdZ4s8p/g1DQEB5hysMrxD0MywiClukY5uNupu3F/JzhSQ1BnHTaFgOb90nFpRoCC1PUjQGGThYD1uOq8PYJpp2DZg4c5pjKLbC4pWLuO4Am4OmNvm1jupUCNin1BrtiZsA7EGQYP+0YvtHPXXD3jWVYB/5GH0zcDXtrRWBhtuT7Kvi+QZtBO6UvWmAjTfrmE21fcfs4uoTTxKRxVPJjTwLaVsZj2PjX5G07xOJ4fcQWN/T7pBy4H7Mk7/YY/g4n/nJ7sHF8k9SJWS0Tfx2V/Jrbyn8tTfNyRAksQMcxpMfsIF36pfkcJh/tO3GuMx4zfWhcYlB2WWj4zGc+04pZKWNRdPiIHjb8rMDCUl8a8PYhYqvObtuwOT+b5d3v6tm3wt8yjKKlpUUPHz48bucTF0eZNd6s8t8gHNyGd+4miqZlcJRTYC2LyIOngseYOrn9nGplHywTHFJuJQQWJzzi7C/lBVP1tC2Z7hfjkHz0PkI7pcszph+mxsDJfYSaxrxZTBqbKQ/nlm5yqIt11IrAMnmLEK+W0wGIm52igxdmuz4ZwzdaxwtMGkclP/Yk0HZvOitnq/jnGaQVWD8heekLSUHcSvI1G/rrMPkswzpt5b+Wpnk5TAQWHqa9fQ/6CvSL9NM49KsljvJfE9p30v610dBvujxZOYFlWVbrunXrjMUK97HntGCp0BVUXoO4wlJhWnbs2KEvuOCCOA0xCY4ya7xZ5b9BOLhN72BPKv/mdkFlcNDyHMN8SffB4j7kuYRJJwKrI/TzQjDTp2MK98SIN0BNZgZoG6THwF1ftNGwD666QAzQWZR2Jp2l/OfCDigzo/xiEvfHROW/ZkFlUBymflNspl6TgZQ+ZWNmji6d0o0WMXiZLs9SwQn7PpPOYdJVEpvUheW6IQb56LkwzZdWYNG8mwzzPcDkM/HXIfnijGu28l9L07wcJgIraDNgryGGji7ROcp/TWjfuYikMV3qW25Qdllo6NWrV+uiRYuMxUolBBb45gvN+dmr7revz8dl4bM7r//+WFnKXrFiRdyGmARHmTXerPLfIEFgD5Y2ptynY5RBoWU5hvmSCixL+T/oy+UTgVUQPBAddHCFHU7hL4QZDaw9mrPxKlgIwRd8XJjGivxKdfxINF63fp3x9fMqXMAhDoPbBXsbk9Zi0tkB5WIJ/TkmPf04dK0LLFonlw/Xj+7dhFikKCGOLUlWKv8xzTLwI86xJ4F+gxExPPRjzBRc8zUkH/ZH+luD+tIKrO+TvBD39DurFIgAel89b+ivQ/LFGdds5b+Wpnk5TAQW4GbjvXYDk8dR/mtC+867SBr0OyMjfEac12skHz5Oz8XapgY3bOvkyZONxUqlBBa2ZPjdkXa94b3W/LIhPgxdLiZNmhS3ISbBUWaNN6v8N0gQf6P8AwOMvvUSVgaFluUY5qu2wMLNsqqY1sToLtcW429nCyx0vnhSbQww/IaN8Gj8DWYmuFk/UyB0fqj81x6zWhDrD6uzMUCYPsfS0zrFvyKPr9x385SN/+c+2NxSLGOJp2y3/OXFY6XtGEsFdNd8YDHl2yHHiw6bzmLRfZU+DAILS6lvk3QQXJi9wb3ziOp47vHEvyJn7yh/TB7OV72BH7Cg9kstyf2G7WiOk/oQlIx2YauCAMObeeOK/8bgvZrJg73ETAbNtAJrJlM38s/x+Jsh/tKgetgDhv46JB/6VsvQV5upN04fS9+sNBVYmOUO2m4D2+Bw2/bQ4+QEFvaTo30l+pVbi8cKfzPF/9rFv29Q/j3mnmTqLwt5gdW/f39jsVIpgVUp8KHnHj16xG2ISXCUv/Fw9WWV/wYJA/EHURupRZXhheZ1DPNVW2DFNZupt9YEVlLDE5bJG0ZhYEf9NJshwtAO/50pG5tkHizDcb6o+Hgbi0lrhxwrZtjoh5CpfRgEFsTtNMa3JPZ1Qz/iWKPBcVLKsd8e7J4Y9WVJ3jgCyyqTv9zmyxwOydesqrMPllb+scJUYOEB75mAMu83PE5OYA3N2e9THhPspgAfUpMXWKhk06ZNRoKlqwmsJ554IklDTIKj/BeOqy9L0jQblE3zUDMpwyXqpglCBNZZHFJuJQXWzoCy44JODoNOks34XMMTIBfjgGVGzBrRN/jKdZwWk96OOF7MxtDge3rNospwcZj8pthMveUSWC7ciwKmhpksbGURFLtC/YhjjQbHyYEBL007xays6QNJWoHl+pt0N3HXX1MckrdZ1b7AAlzMHyxoSc8h6TiBhX4HM+Jh93mU3acquZO7KgqsGTNmBIqUtrY2vWbNGp3NZvXixYv14MGDSw7ib51p8AvbMAQxbty4JA0xCY7yXzyuvixJ02xQNpYCwjockzJcom6aIERgncUh5ZZTYGHZDB9KxVfmMbVdzv1Z0CFBeODNTtNPkeDYsIww1qB8xJ7giRTBpiYDDgRZoypsPxEWm2YxeW0Df7IRx2VSBnCY/KbYTL3lFlggk7PvKf+nqTiDqMKSTVYV3t4KeyGB+hHHGg2OMwhLFdpps/IvZwbdN3gxBA8BJi9vuJRDYIFM0V/TnefhL5YK7Zj+OqQcnB/LMK9t6FuQOaS8OAIL0Dd8t4akdUjaoPhVnDvcF+ijTPs0pEOcZtJtb4wpCaxBgwbpo0ePsiJl3rx5euDAgbpfv366b9+++pxzzik5i791psEviD6OAwcO6N69eydpiElA2Rli3KcW6N4dowzLv5opP24ZislrGeZDQx5J8pq81YZzMMogXz3jWxyjgaU9GX+5GJMkWKRcxH9xQoheaxNDWfgaPbc7fblAR4UN9/CxVVsV3sByioaNAKcV/44ds9Hu4mxeieB1BOpjSfLGYlmOx2YWy0bdiLexDMrEtcyo8OvNYTH5XBttWEZQOaYMYOo1Ec20TpN8fXP2D+psvA+253A8ZhftC6pwb5i8OUX9iGNpZ177Fcv4Z1Xwm7al2epsO4VQxP0dR6yoYnp6n0YFSnN0K/qLvNcV/Zqugts+ridm2UzetvViEV/Rt5p+0oe2xbhmkfK4MYGm8ULPM30r1oul/Nck7Nqij0Kf5sZb4Vw7HnPjsqYU0+GFgrjnPjYlgQW744479OnT/t3Sr7322jSqt+LGzb5hVmv+/PlJlb4gCIIgCEJiOggszGLt3r3bJ1awFIe4K8uy8suDxaDxvOFvnWnDhg3LLxNStmzZkv9dicASBEEQBKHKdBBYsOnTp+szZ4J3Z+8KQe7t7e164sSJdKZLBJYgCIIgCFXBJ7AQY9XY2BgoXrqCwMKMlneWTYnAEgRBEAShivgEFmzo0KF63759rHg5duyYvvrqq/Pp+vTpU2XpFM327dv1lVdeycVqicASBEEQBKEqsAILNmXKlEAR8/zzz+ubb75Zr1y5sorSyYxRo0bpbt26icASBEEQBKHTCBRYsOXLl+uTJ092tmYyZsGCBWFvG4rAEgRBEAShKoQKrLq6Oj179uyaF1kIar/99tujtnMQgSUIgiAIQlUIFViw888/v6ZnsuDXww8/nI8HCzsOJQJLEARBEIQqESmwYOedd56+7bbb8gHutcShQ4fym6P26tXLZENSEViCIAiCIFQFI4HlmuM4NTOThWXBadOmxdnxXQSWIAiCIAhVIZbAgmHn9Oeee67ThBU2QV21alWHvbgMTQSWIAiCIAhVIbbAgp177rn54PeWlpaqiqvm5mY9Z86cDh+bjmEisARBEARBqAqJBJZrmM1aunSpfvvtt0M/r5MGfHz6nXfe0YsWLcp/WxBvNib0VwSWIAiCIAhVIZXAgnXv3l1fdNFFet68eXrPnj1lFVf79+/XM2fOzJefxkclAksQBEEQhCqSWmB5DbNLY8eO1ffee6/evHlzPhA9DnhLcf369XrhwoV69OjRZfHJYyKwBEEQBEGoCmUVWJzV19frCRMmaNu29dy5c/NvIrqGeCr8fdy4cXrQoEFplv9EYAmCIAiCUDP0z9nUnNn/D+z6nPVWgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIQqX4PyE8gGQdLaaxAAAAAElFTkSuQmCC';
const font = 'Calibri'

class DocumentCreator {
    create(order) {
        console.log(order,"ORDER")
        let stotal = 0
        let totalWeight = 0
        let date = new Date();
        date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        const orderData = JSON.parse(order)
        orderData.order.map((elem, index) => {
            if (elem.ExportDescription === null || elem.ExportDescription === "undefined" || !elem.ExportDescription)
                elem.ExportDescription = elem.ProductCode + " - " + elem.ProductName
            stotal += (elem.Qty * (elem.Price - ((elem.Discount / 100) * elem.Price)).toFixed(2));
            totalWeight += elem.ProductWeight
        })
        orderData.order = orderData.order.filter(elem => elem.isChild === 0)
       let shippingArray =[];
       let billingArray=[];
        if(orderData.order[0].ShipFirstName!=="" && orderData.order[0].ShipLastName!=="" && orderData.order[0].ShipFirstName!==undefined && orderData.order[0].ShipLastName!==undefined) {
            shippingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].ShipFirstName} ${orderData.order[0].ShipLastName}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].ShipCompanyName!=="" && orderData.order[0].ShipCompanyName!==undefined){
            shippingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].ShipCompanyName}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].ShipAddress1!=="" && orderData.order[0].ShipAddress1!==undefined){
            shippingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].ShipAddress1}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].ShipAddress2!=="" && orderData.order[0].ShipAddress2!==undefined){
            shippingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].ShipAddress2}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].ShipCity!=="" && orderData.order[0].ShipCity!==undefined || orderData.order[0].ShipState!=="" && orderData.order[0].ShipState!==undefined || orderData.order[0].ShipPostalCode!=="" && orderData.order[0].ShipPostalCode!==undefined){
            shippingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].ShipCity?orderData.order[0].ShipCity+', ':''}${orderData.order[0].ShipState?orderData.order[0].ShipState+' ':''} ${orderData.order[0].ShipPostalCode}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].ShipCountry!=="" && orderData.order[0].ShipCountry!==undefined){
            shippingArray.push( new TextRun({
                font,
                text: ` ${orderData.order[0].ShipCountry}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].ShipPhoneNumber!=""&& orderData.order[0].ShipPhoneNumber!=undefined){
            shippingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].ShipPhoneNumber}`,
                break: 1,
                bold: true
            }))
        }


        if(orderData.order[0].CustomerFName!=="" && orderData.order[0].CustomerLName!=="" && orderData.order[0].CustomerFName!==undefined && orderData.order[0].CustomerLName!==undefined) {
            billingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].CustomerFName} ${orderData.order[0].CustomerLName}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].CustomerCompany!=="" && orderData.order[0].CustomerCompany!==undefined){
            billingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].CustomerCompany}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].BillingStreetAddress1!=="" && orderData.order[0].BillingStreetAddress1!==undefined){
            billingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].BillingStreetAddress1}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].BillingStreetAddress2!=="" && orderData.order[0].BillingStreetAddress2){
            billingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].BillingStreetAddress2}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].BillingCity1!=="" && orderData.order[0].BillingCity1!=="undefined" || orderData.order[0].BillingState!=="" && orderData.order[0].BillingState!=="undefined" || orderData.order[0].BillingPostalCode!=="" && orderData.order[0].BillingPostalCode!=="undefined"){
            billingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].BillingCity1?orderData.order[0].BillingCity1+', ':''}${orderData.order[0].BillingState?orderData.order[0].BillingState+' ':''}${orderData.order[0].BillingPostalCode}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].BillingCountry1!=="" && orderData.order[0].BillingCountry1!==undefined){
            billingArray.push( new TextRun({
                font,
                text: ` ${orderData.order[0].BillingCountry1}`,
                break: 1,
                bold: true
            }))
        }
        if(orderData.order[0].BillingPhoneNumber!=""&& orderData.order[0].BillingPhoneNumber!=undefined){
            billingArray.push(new TextRun({
                font,
                text: ` ${orderData.order[0].BillingPhoneNumber}`,
                break: 1,
                bold: true
            }))
        }

        const headTable = new Table({
            columnWidths: [3900, 2000],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            borders: TableBorders.NONE,
            alignment: AlignmentType.CENTER,
            rows: [
                new TableRow({
                    keepNext: true,
                    children: [
                        new TableCell({
                           borders: {
                                top: {
                                    style: BorderStyle.NONE
                                },
                                bottom: {
                                    style: BorderStyle.NONE
                                },
                                left: {
                                    style: BorderStyle.NONE
                                },
                                right: {
                                    style: BorderStyle.NONE
                                },
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: Buffer.from(imageBase64Data, "base64"),
                                            transformation: {
                                                width: 408,
                                                height: 58,
                                            },
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            borders: {
                                top: {
                                    style: BorderStyle.NONE
                                },
                                bottom: {
                                    style: BorderStyle.NONE
                                },
                                left: {
                                    style: BorderStyle.NONE
                                },
                                right: {
                                    style: BorderStyle.NONE
                                },
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new TextRun({
                                            font,
                                            text: `1850 Research Drive`,
                                            break: 1,
                                        }),
                                        
                                        new TextRun({
                                            font,
                                            text: "Troy, MI 48083",
                                            break: 1,
                                        }),
                                        new TextRun({
                                            font,
                                            text: "United States",
                                            break: 1,
                                        }),
                                        new TextRun({
                                            font,
                                            text: "(PH)   586.731.7950",
                                            break: 1,
                                        }),
                                        new TextRun({
                                            font,
                                            text: "(FAX)  586.731.2274",
                                            break: 1,
                                        }),
                                    ],

                                })
                            ],
                        }),
                    ],
                }),
            ]
        })

        const detailTable = new Table({
            alignment: AlignmentType.CENTER,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            font,
                                            text: "Proforma Invoice",
                                            bold: true,
                                            size: 30,
                                        }),
                                    ],
                                    alignment: AlignmentType.START,
                                })
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    children: [
                                        new TextRun({
                                            font,
                                            text: "Shipper Info",
                                            bold: true,
                                            size: 30,
                                        }),

                                    ],
                                })
                            ],
                        }),

                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    children: [
                                        new TextRun({
                                            font,
                                            text: ` Date: ${orderData.order[0].OrderDatePDF}`,
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: ` Order Number: ${orderData.order[0].OrderID}`,
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: ` Purchase Order No: ${orderData.order[0].PONum = orderData.order[0].PONum ? orderData.order[0].PONum : "N/A"}`,
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: ` Incoterm: ${orderData.order[0].Incoterm = orderData.order[0].Incoterm ? orderData.order[0].Incoterm : "N/A"}`,
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: ` Reason for Export: ${orderData.order[0].Order_Type = orderData.order[0].Order_Type === "Customer" ? "Sale".toUpperCase() : (orderData.order[0].Order_Type === "RMA" ? "Returned Repair".toUpperCase() : orderData.order[0].Order_Type.toUpperCase())}`,
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: ` Freight: ${orderData.shippingMethod}`,
                                            break: 1,
                                            bold: true,
                                        }),
                                    ],

                                })
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    children: [
                                        new TextRun({
                                            font,
                                            text: ` Intrepid Control Systems, Inc.`,
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: " 1850 Research Drive ",
                                            break: 1,
                                            bold: true,
                                        }),
                                        
                                        new TextRun({
                                            font,
                                            text: " Troy, MI 48083",
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: " United States",
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: " Phone 586-731-7950 ",
                                            break: 1,
                                            bold: true,
                                        }),
                                        new TextRun({
                                            font,
                                            text: " TAX ID: 38-3315407 ",
                                            break: 1,
                                            bold: true,
                                        })
                                    ],

                                })

                            ],
                        }),

                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    children: [
                                        new TextRun({
                                            font,
                                            text: "Ship To",
                                            bold: true,
                                            size: 30,
                                        }),
                                    ],
                                })
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            font,
                                            text: "Bill To",
                                            bold: true,
                                            size: 30,
                                        }),
                                    ],
                                    alignment: AlignmentType.START,
                                })
                            ],
                        }),

                    ],
                }),


                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    children: shippingArray
                                })
                            ],      
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    children: billingArray

                                })
                            ],
                        }),

                    ],
                }),
            ]
        })

        const document = new Document({
            sections: [{
                margins: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                size: {
                    width: 12240,//21.59cm
                    height: 15840,//27.94cm
                },
                children: [
                    headTable,
                    new Paragraph({
                        text: " "
                    }),
                    new Paragraph({
                        text: " "
                    }),
                    detailTable,
                    new Paragraph({
                        text: " "
                    }),
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Item ",
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Qty ",
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Unit of Measure ",
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }), new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Description of Goods ",
                                                        bold: true,
                                                        size: 20,
                                                    }),
                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " COO ",
                                                        bold: true,
                                                        size: 20,
                                                    }),
                                                ],
                                            })
                                        ],
                                    }), new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Harmonized Code ",
                                                        bold: true,
                                                        size: 20,
                                                    }),
                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " ECCN ",
                                                        bold: true,
                                                        size: 20,
                                                    }),
                                                ],
                                            })
                                        ],
                                    }), new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Unit Value USD ",
                                                        bold: true,
                                                        size: 20,
                                                    }),
                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: " Total Value USD ",
                                                        bold: true,
                                                        size: 20,
                                                    }),
                                                ],
                                            })
                                        ],
                                    }),

                                ],
                            }),

                            ...orderData.order.map((elem, index) => {
                                return new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${(index + 1)}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),

                                                    ],
                                                })
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${elem.Qty}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),

                                                    ],
                                                })
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${elem.UnitOfMeasure = elem.UnitOfMeasure != null ? elem.UnitOfMeasure : "N/A"}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),

                                                    ],
                                                })
                                            ],
                                        }), new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${elem.ExportDescription}`,
                                                            bold: true,
                                                            size: 20,

                                                        })
                                                    ],
                                                })
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${elem.CountryOfOrigin}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),
                                                    ],
                                                })
                                            ],
                                        }), new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${elem.HarmonizedCode = elem.HarmonizedCode != null ? elem.HarmonizedCode : "N/A"}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),
                                                    ],
                                                })
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${elem.ExportControlClassificationNumber}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),
                                                    ],
                                                })
                                            ],
                                        }), new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.RIGHT,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${(elem.Price - ((elem.Discount / 100) * elem.Price)).toFixed(2)}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),
                                                    ],
                                                })
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.RIGHT,
                                                    children: [
                                                        new TextRun({
                                                            font,
                                                            text: `${(elem.Qty * (elem.Price - ((elem.Discount / 100) * elem.Price)).toFixed(2)).toFixed(2)}`,
                                                            bold: true,
                                                            size: 20,
                                                        }),
                                                    ],
                                                })
                                            ],
                                        }),

                                    ],
                                })
                            }).reduce((prev, curr) => prev.concat(curr), []),

                        ]
                    }),
                    new Paragraph({
                        text: " "
                    }),
                    new Table({
                        // columnWidths: [5000],
                        alignment: AlignmentType.END,
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: {
                                            right: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.START,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `Subtotal:`,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        borders: {
                                            left: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.RIGHT,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `$${stotal.toFixed(2)} `,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                ],

                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: {
                                            right: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.START,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `Freight Charges:`,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        borders: {
                                            left: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.END,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `${orderData.currency + orderData.order[0].Freight.toFixed(2)} `,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                ],

                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: {
                                            right: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.START,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `Invoice Total USD:`,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        borders: {
                                            left: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.END,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `${orderData.currency + orderData.order[0].PaymentAmount.toFixed(2)} `,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                ],

                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: {
                                            right: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.START,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: "Total No. of Packages:",
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        borders: {
                                            left: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.END,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: "1 ",
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                ],

                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: {
                                            right: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.START,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `Total Weight:`,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                    new TableCell({
                                        borders: {
                                            left: {
                                                style: BorderStyle.NIL,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.END,
                                                children: [
                                                    new TextRun({
                                                        font,
                                                        text: `${totalWeight}lbs `,
                                                        bold: true,
                                                        size: 20,
                                                    }),

                                                ],
                                            })
                                        ],
                                    }),
                                ],

                            }),
                        ]

                    }),
                    new Paragraph({
                        alignment: AlignmentType.START,
                        children: [
                            new TextRun({
                                font,
                                text: "Shipper Signature:",
                                bold: true,
                                size: 20,
                            }),

                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.START,
                        children: [
                            new TextRun({
                                font,
                                text: " ",
                                bold: true,
                                size: 20,
                            }),

                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.START,
                        children: [
                            new TextRun({
                                font,
                                text: `Date: ${date}`,
                                bold: true,
                                size: 20,
                            }),

                        ],
                    }),


                    // ...educations
                    //     .map((education) => {
                    //         const arr = [];
                    //         arr.push(
                    //             this.createInstitutionHeader(education.schoolName, `${education.startDate.year} - ${education.endDate.year}`),
                    //         );
                    //         arr.push(this.createRoleText(`${education.fieldOfStudy} - ${education.degree}`));

                    //         const bulletPoints = this.splitParagraphIntoBullets(education.notes);
                    //         bulletPoints.forEach((bulletPoint) => {
                    //             arr.push(this.createBullet(bulletPoint));
                    //         });

                    //         return arr;
                    //     }).reduce((prev, curr) => prev.concat(curr), []),
                ],
            }],
        });

        return document;
    }

}

const GenerateDOC = async function (order) {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(order);

    const b64string = await Packer.toBuffer(doc);
    // fs.writeFile(process.cwd() + '/test.docx', b64string, (err, data) => {
    //     if (!err)
    //         console.log('done');
    //     else
    //         console.log(err);
    // })
    return b64string

}

module.exports = GenerateDOC