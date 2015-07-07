var jsdom = require("jsdom");
var ProfileClass = require("./data-containers/profile");
var Experience = require("./data-containers/experience");
var Honors = require("./data-containers/honors");
var Project = require("./data-containers/projects");
var Education = require("./data-containers/education");

function getProfile(linkedInURL, callback) {
    jsdom.env({
        url: linkedInURL,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function(errors, window) {
            var $ = window.$;
            var profile = new ProfileClass();
            profile.name = $("#name h1 span span").text();
            profile.headline = $("#headline p").text();
            profile.location = $("#location dl dd span").text();
            profile.current = $("#overview-summary-current td ol li a").text();
            $("#overview-summary-past td ol li").each(function() {
                var company = $(this).text();
                company = company.split(",")[0];
                profile.past.push(company);
            });

            profile.education = $("#overview-summary-education td ol li").text();
            $("#overview-summary-websites td ul li").each(function() {
                profile.websites.push($(this).find("a[href]").attr("href"));
            });
            $("#background-experience div div").each(function() {
                profile.experience.push(new Experience($(this).find("header h4").text(),
                    $(this).find("header a").text(),
                    $(this).find(".experience-date-locale").clone().find(".locality").remove().end().text(),
                    $(this).find("span span.locality").text(),
                    $(this).find("p").html()));
            });
            $("#background-honors div div div").each(function() {
                profile.honors.push(new Honors($(this).find("h4 span").text(),
                    $(this).find("h5 span").text(),
                    $(this).find("> span").text(),
                    $(this).find("p").text()));
            });

            $("#background-projects div div").each(function() {
                profile.projects.push(new Project($(this).find("hgroup h4 a span:first").text(),
                    $(this).find("> span.projects-date").text(),
                    $(this).find("> p").text(),
                    $(this).find("hgroup h4 a[href]").attr("href")));
            });

            $("#background-education div div div").each(function() {
                profile.educationlist.push(new Education($(this).find("header h4").text(),
                    $(this).find("header h4 a[href]").attr("href"),
                    $(this).find("header h5 span:first").text(),
                    $(this).find("header h5 span:eq(2)").text(),
                    $(this).find("header h5 span:last").text(),
                    $(this).find("> span").text()));
            });
            callback(profile);
        }
    });
}

module.exports = getProfile;